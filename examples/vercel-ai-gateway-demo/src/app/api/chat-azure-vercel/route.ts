import { generateText } from "ai";
import { createAzure } from "@ai-sdk/azure";

const azure = createAzure({
  resourceName: process.env.AZURE_API_BASE,
  apiKey: process.env.AZURE_API_KEY || "",
  baseURL: `https://oai.helicone.ai/openai/deployments`,
  apiVersion: process.env.AZURE_API_VERSION || "2025-01-01-preview",
  headers: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    "Helicone-OpenAI-Api-Base": process.env.AZURE_API_BASE || "",
  },
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const result = await generateText({
      model: azure(process.env.AZURE_DEPLOYMENT_NAME || "gpt-4o-mini"),
      prompt: messages[0]?.content || "Hello",
      maxOutputTokens: 100,
    });

    return Response.json({ text: result.text });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to process request",
        details: (error as Error)?.message,
      },
      { status: 500 }
    );
  }
}
