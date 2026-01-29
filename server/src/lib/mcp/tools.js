// 1. Tool definitions
const COVERSATION_HISTORY_TOOL = {
  functionDeclarations: [
    {
      name: "retrieve_interaction_logs",
      description: "Required tool to fetch data for hexadecimal node IDs.",
      parameters: {
          type: "object",
          properties: {
            nodeA: { 
              type: "string"
            },
            nodeB: { 
              type: "string"
            }
          },
          required: ["nodeA", "nodeB"]
        }

    }
  ]
};

export const CHAT_APP_TOOLS = [
  COVERSATION_HISTORY_TOOL
];