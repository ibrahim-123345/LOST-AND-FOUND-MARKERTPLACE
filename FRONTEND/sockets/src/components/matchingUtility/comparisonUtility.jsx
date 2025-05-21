

const TOGETHER_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"; 
const TOGETHER_API_KEY = "cd01dfd203806c4248c2221302ea68c87fec4287aa8602cfb16df23838ed1fe4"

const SAVE_MATCHES_URL = "api/matches";





const createBatchPrompt = (lostItems, foundItems) => {
  let prompt = `
You are a semantic analyzer tasked with comparing pairs of lost and found items.

For each pair, return the similarity score (0 to 1) and a short explanation sentence.

Return a JSON array where each element is an object:
{
  "lostIndex": <index of lost item>,
  "foundIndex": <index of found item>,
  "score": <number between 0 and 1>,
  "explanation": "<short explanation>"
}

Pairs:
`;

  lostItems.forEach((lost, lostIndex) => {
    foundItems.forEach((found, foundIndex) => {
      prompt += `
Lost (${lostIndex}): "${lost.description}"
Found (${foundIndex}): "${found.description}"
`;
    });
  });

  prompt += `
Please respond ONLY with the JSON array described above, nothing else.
`;

  return prompt;
};

export async function compareAllPairs(lostItems, foundItems, threshold = 0.6) {
  const prompt = createBatchPrompt(lostItems, foundItems);

  try {
    const res = await axios.post(
      TOGETHER_URL,
      {
        model: TOGETHER_MODEL,
        messages: [
          { role: "system", content: "You are a semantic analyzer." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponse = res.data.choices[0].message.content.trim();

    let comparisonResults;
    try {
      comparisonResults = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("Failed to parse JSON from LLM response:", parseError);
      console.error("Raw response:", rawResponse);
      throw new Error("Invalid JSON response from LLM");
    }

    const bestMatches = [];

    lostItems.forEach((lost, lostIndex) => {
      const matchesForLost = comparisonResults.filter(
        (item) => item.lostIndex === lostIndex
      );

      if (!matchesForLost.length) {
        bestMatches.push({
          lostItemId: lost.id,
          foundItemId: null,
          lostUser: {
            username: lost.user?.username || "unknown",
            email: lost.user?.email || "unknown@example.com",
          },
          foundUser: {
            username: null,
            email: null,
          },
          matchScore: 0,
          status: "pending",
          explanation: "No matches found",
        });
        return;
      }

      const best = matchesForLost.reduce((best, current) => {
        return current.score > best.score ? current : best;
      }, { score: -1 });

      if (best.score >= threshold) {
        const found = foundItems[best.foundIndex];
        bestMatches.push({
          lostItemId: lost.id,
          foundItemId: found.id,
          lostUser: {
            username: lost.user?.username || "unknown",
            email: lost.contactInfo || "unknown@example.com",
          },
          foundUser: {
            username: found.user?.username || "unknown",
            email: found.contactInfo || "unknown@example.com",
          },
          matchScore: best.score,
          status: "pending",
          explanation: best.explanation || "No explanation provided",
        });
      } else {
        bestMatches.push({
          lostItemId: null,
          foundItemId: null,
          lostUser: {
            username: lost.user?.username || "unknown",
            email: lost.user?.email || "unknown@example.com",
          },
          foundUser: {
            username: null,
            email: null,
          },
          matchScore: 0,
          status: "pending",
          explanation: "No suitable match found",
        });
      }
    });

    // Send to your server
    for (const match of bestMatches) {
      try {
        await axiosInstance.post(SAVE_MATCHES_URL, match);
      } catch (err) {
        console.error("Failed to save match to server:", err.message);
      }
    }

    console.log("All matches processed and saved.");
    return bestMatches;
  } catch (error) {
    console.error("Comparison failed:", error.message);
    return [];
  }
}

export default compareAllPairs;
