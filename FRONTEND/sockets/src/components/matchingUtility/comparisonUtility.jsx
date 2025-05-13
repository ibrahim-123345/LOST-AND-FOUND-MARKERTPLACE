import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const SAVE_MATCHES_URL = "http://localhost:5000/api/matches"; // <-- change to your backend endpoint

export async function compareTexts(lost, found) {
  const prompt = `
You are a semantic analyzer tasked with comparing a lost item description with a found item description.

Return:
- A similarity score between 0 and 1 (1 = perfect match, 0 = no match)
- A short explanation (1 sentence) justifying the score, like "Both refer to a phone lost in similar places"

Format your response exactly like this:
Score: <number>
Match: <short explanation>

Lost: "${lost.description}"
Found: "${found.description}"
`;

  try {
    const res = await axios.post(OLLAMA_URL, {
      model: "phi3:mini",
      prompt,
      stream: false,
    });

    const response = res.data.response.trim();

    const scoreMatch = response.match(/Score:\s*([01](?:\.\d+)?)/i);
    const matchText = response.match(/Match:\s*(.*)/i);

    return {
      lostItem: lost,
      foundItem: found,
      score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
      match: matchText ? matchText[1] : "No explanation provided",
    };
  } catch (error) {
    console.error("Comparison failed:", error.message);
    return {
      lostItem: lost,
      foundItem: null,
      score: 0,
      match: "Error during comparison",
    };
  }
}


export async function compareAllPairs(lostItems, foundItems, threshold = 0.6) {
  const bestMatches = [];

  for (const lost of lostItems) {
    const comparisons = foundItems.map((found) => compareTexts(lost, found));
    const results = await Promise.all(comparisons);

    const bestMatch = results.reduce(
      (best, current) => (current.score > best.score ? current : best),
      { score: -1 }
    );

    const matchResult =
      bestMatch.score >= threshold
        ? bestMatch
        : {
            lostItem: lost,
            foundItem: null,
            score: 0,
            match: "No suitable match found",
          };

    bestMatches.push(matchResult);
  }

 
  try {
    await axios.post(SAVE_MATCHES_URL, { matches: bestMatches });
    console.log("✅ Matches sent to the server.");
  } catch (error) {
    console.error("❌ Failed to send matches:", error.message);
  }

  return bestMatches;
}
