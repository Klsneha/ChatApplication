import { GEMINI_MODEL, gemini } from "../lib/llm/gemini.js";
import { CHAT_APP_TOOLS } from "../lib/mcp/tools.js";
import { createMcpClient } from "../lib/mcp/client.js";
import { HarmCategory, HarmBlockThreshold } from "@google/genai";

const systemPrompt = `
You are a specialized Function Calling Agent. 
Your only way to access data is by calling the retrieve_interaction_logs tool. 
When provided with hex IDs, you MUST call the tool first. 
Do not discuss your limitations as an AI. 
Do not suggest how the user can fetch logs. 
Just call the tool.
`;

const getQueryResponse = async (req, res) => {
  try {

    const userMessage = req.body.message;
    // 1️⃣ Ask LLM what to do
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: systemPrompt,
        tools: CHAT_APP_TOOLS,
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY", 
            allowedFunctionNames: ["retrieve_interaction_logs"]
          }
        }
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    });

    // console.log("Full Gemini Response:", JSON.stringify(response, null, 2));

    console.log("** response.candidates?.[0]?.content", JSON.stringify(response.candidates?.[0]?.content));
    // console.dir(response.candidates[0].content.parts, { depth: null });

    const part =
    response.candidates?.[0]?.content?.parts?.[0];

    console.log("** part", part);

    // 2️⃣ Decide if tool is needed (simple example)
    if (part?.functionCall) {

      console.log("here");
      
        const { name, args } = part.functionCall;
        console.log("here", `${name} - ${JSON.stringify(args)}`);
        const mcp = await createMcpClient();

        // Get available search tools
        const { tools } = await mcp.listTools();
        console.log(`Available tools: ${tools.map((t) => t.name).join(", ")}`);

        const toolResult = await mcp.callTool({
          name,
          arguments: args,
        });

        const mcpDataText = toolResult.content[0].text; 

        // 2. Send the "Second Turn" to Gemini
        const finalResponse = await gemini.models.generateContent({
          model: GEMINI_MODEL,
          contents: [
            // Turn A: The original user request
            {
              role: "user",
              parts: [{ text: userMessage }]
            },
            // Turn B: The model's "decision" to call the tool (the part you already have)
            {
              role: "model",
              parts: [part] // This is the part that contains the functionCall
            },
            // Turn C: The result from your MongoDB (via MCP)
            {
              role: "user", 
              parts: [{
                functionResponse: {
                  name: "retrieve_interaction_logs",
                  response: { 
                    content: mcpDataText // This is what Gemini will actually summarize
                  }
                }
              }]
            }
          ],
          // Keep the same config so it stays in context
          config: {
            systemInstruction: "You are a log analyst. Summarize the provided data clearly."
          }
        });

        console.log("FINAL SUMMARY FROM AI:");
        console.log(finalResponse.candidates[0].content.parts[0].text);

        return res.json({
          reply: finalResponse.candidates[0].content.parts[0].text,
        });
      }

    // 3️⃣ Otherwise return normal text
    res.json({
      reply: response.text,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
}

export const chatBotController = {
  getQueryResponse
}