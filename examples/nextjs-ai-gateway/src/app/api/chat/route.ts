import { generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";

const gateway = createGateway({
  apiKey: process.env.VERCEL_AI_GATEWAY_API_KEY,
  baseURL: "https://vercel.helicone.ai/v1/ai",
  headers: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const result = await generateText({
      model: gateway("anthropic/claude-3-5-sonnet"),
      prompt: messages[0]?.content || "Hello",
      maxOutputTokens: 100,
    });

    return Response.json({ text: result.text });
  } catch (error) {
    return Response.json(
      { error: "Failed to process request", details: (error as any)?.message },
      { status: 500 }
    );
  }
}