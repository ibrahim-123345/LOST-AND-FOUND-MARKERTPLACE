const TOGETHER_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"; 
const TOGETHER_API_KEY = "cd01dfd203806c4248c2221302ea68c87fec4287aa8602cfb16df23838ed1fe4";

const SAVE_MATCHES_URL = "api/matches";
import axiosInstance from "../../axiosInstance";
import axios from "axios";
import { jsonrepair } from "jsonrepair";

//import { sendFoundItemNotification } from "./emailTool"; 

const createBatchPrompt = (lostItems, foundItems, threshold = 0.6) => {
  let prompt = `
You are a semantic analyzer tasked with comparing lost and found items based on their descriptions.

For each relevant match (score ≥ ${threshold}), return an object with the following structure:

{
  "lostItemId": "<lost item ID>",
  "foundItemId": "<found item ID>",
  "lostUser": {
    "username": "<lost item user username or 'unknown'>",
    "email": "<lost item user email or 'unknown@example.com'>"
  },
  "foundUser": {
    "username": "<found item user username or 'unknown'>",
    "email": "<found item user email or 'unknown@example.com'>"
  },
  "matchScore": <number between 0 and 1>,
  "status": "pending",
  "explanation": "<short explanation why these items match>"
}

Only include matches with a score of ${threshold} or above.

Here are the lost and found item pairs to compare:
`;

  lostItems.forEach((lost) => {
    foundItems.forEach((found) => {
      prompt += `
Lost:
- ID: ${lost.id}
- User: ${lost.user?.username || "unknown"}, ${lost.user?.email || "unknown@example.com"}
- Description: "${lost.description}"

Found:
- ID: ${found.id}
- User: ${found.user?.username || "unknown"}, ${found.contactInfo || "unknown@example.com"}
- Description: "${found.description}"
`;
    });
  });

  prompt += `

IMPORTANT: Return ONLY the JSON array described above. No extra text or formatting.
`;

  return prompt;
};

export async function compareAllPairs(lostItems, foundItems, threshold = 0.6) {
  const prompt = createBatchPrompt(lostItems, foundItems, threshold);

  try {
    const res = await axios.post(
      TOGETHER_URL,
      {
        model: TOGETHER_MODEL,
        messages: [
          { role: "system", content: "You are a semantic analyzer." },
          { role: "user", content: prompt },
        ],
        max_tokens: 2000,
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
      comparisonResults = JSON.parse(jsonrepair(rawResponse));
    } catch (parseError) {
      console.error("Failed to parse JSON from LLM response:", parseError);
      console.error("Raw response:", rawResponse);
      throw new Error("Invalid JSON response from LLM");
    }

    const bestMatches = [];

    const matchedLostIds = new Set(comparisonResults.map((m) => m.lostItemId));

    // Add valid matches (already filtered by LLM)
    for (const match of comparisonResults) {
      bestMatches.push(match);
    }

    // Add unmatched lost items
    for (const lost of lostItems) {
      if (!matchedLostIds.has(lost.id)) {
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
          explanation: "No suitable match found",
        });
      }
    }

    // Send to your server and trigger email notification for strong matches
    for (const match of bestMatches) {
      try {
        await axiosInstance.post(SAVE_MATCHES_URL, match);

        if (match.lostItemId) {
          await axiosInstance.put(`/lost/update/${match.lostItemId}`, {
            status: "found",
          });
        }

        if (
          match.matchScore >= threshold &&
          match.lostUser?.email &&
          match.foundUser?.email
        ) {
          try {
            const response = await axiosInstance.post("http://localhost:7000/email/notify", {
              email: match.lostUser.email,
              data: {
                lostItemId: match.lostItemId,
                foundItemId: match.foundItemId,
                lostUsername: match.lostUser.username,
                foundUsername: match.foundUser.username,
                explanation: match.explanation,
                claimLink: `http://localhost:5173/foundid/${match.foundItemId}`,
              },
            });

            console.log("Email result:", response.data.message);
          } catch (emailErr) {
            console.error(
              "Email sending failed:",
              emailErr.response?.data?.error || emailErr.message
            );
          }
        }
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
