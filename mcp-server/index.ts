
import { z } from "zod";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Message from "./models/message.js";
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, type Tool } from "@modelcontextprotocol/sdk/types.js";

dotenv.config({ quiet: true });

const log = (...args: any[]) => {
  process.stderr.write(args.map(a =>
    typeof a === "string" ? a : JSON.stringify(a)
  ).join(" ") + "\n");
};

const connectToMongoDB = async () => {
  try {
    if (!process.env.DATABASE_URI) {
      throw new Error("DATABASE_URI is not set in environment variables");
    }

    mongoose.set('bufferCommands', false);
    
    const con = await mongoose.connect(process.env.DATABASE_URI, {
      serverSelectionTimeoutMS: 60000 // Increase timeout for server selection
    });
    log("Mongo Db Connected", con.connection.host);
    return con;
  } catch (error) {
    log("Database Connection error", error);
    throw error; // Re-throw to prevent server from starting without DB
  }
};

await connectToMongoDB();

// 1. Tool definitions
const COVERSATION_HISTORY_TOOL: Tool = {
  name: "retrieve_interaction_logs",
  description: "Retrieves technical event logs between two system nodes (nodeA and nodeB) for analysis.",
  inputSchema: {
    type: "object",
    properties: {
      nodeA: {
        type: "string",
        description: "Primary system identifier"
      },
      nodeB: {
        type: "string",
        description: "Secondary system identifier"
      }
    },
    required: ["nodeA", "nodeB"]
  }
};

const CHAT_APP_TOOLS = [
  COVERSATION_HISTORY_TOOL
] as const;


// 2. Initialize MCP Server
export const mcpServer = new Server(
  {
  name: "chat-backend-mcp",
  version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  });

// 3. Register the Tool
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: CHAT_APP_TOOLS,
}));


mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "retrieve_interaction_logs") {

    const ArgsSchema = z.object({
      nodeA: z.string(),
      nodeB: z.string(),
    });
    
    const { nodeA, nodeB } = ArgsSchema.parse(
      request.params.arguments
    );

    // Convert string IDs to ObjectIds with validation
    let senderObjectId: mongoose.Types.ObjectId;
    let receivedObjectId: mongoose.Types.ObjectId;
    
    try {
      senderObjectId = new mongoose.Types.ObjectId(nodeA);
      receivedObjectId = new mongoose.Types.ObjectId(nodeB);
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Invalid user ID format: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
      };
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const messages = await Message.find({
        createdAt: { $gte: since },
        $or: [
          {senderId: senderObjectId, receivedId: receivedObjectId },
          {senderId: receivedObjectId, receivedId: senderObjectId }
        ]
      }).sort({ createdAt: 1 }).lean().maxTimeMS(120000);

      if (messages.length === 0) {
        return {
          content: [{ type: "text", text: "No messages found." }],
        };
      }

      log("** messages", messages);

      const formattedChat = messages.map(m => `${m.senderId} -> ${m.receivedId}: ${m.text}`).join("\n");
      
      return {
        content: [{ type: "text", text: formattedChat || "No messages found." }],
      };
    } catch (error) {
      log("Error fetching messages:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching messages: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
      };
    }
  }
  throw new Error("Tool not found");
});


async function start() {
  try {
    // 2️⃣ Start MCP over stdio
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    log("MCP server connected (stdio)");
  } catch (err) {
    log("Startup failed", err);
    process.exit(1);
  }
}

start();