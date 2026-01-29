import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function createMcpClient() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["../mcp-server/index.ts"],
  });

  const client = new Client(
    { name: "chat-mcp-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);

  return client;
}