# Vercel AI Gateway + Helicone Demo

An interactive AI debate simulator showcasing different Vercel AI Gateway integration methods with Helicone observability.

## 🎯 What This Demo Shows

This Next.js app demonstrates four different ways to integrate with Vercel AI Gateway through Helicone:

1. **Vercel AI SDK** - Non-streaming text generation
2. **Vercel AI SDK (Stream)** - Real-time streaming responses  
3. **OpenAI SDK** - Drop-in replacement with non-streaming
4. **OpenAI SDK (Stream)** - Drop-in replacement with streaming

All methods route through Helicone for observability, logging, and analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Helicone account ([sign up free](https://helicone.ai))
- Vercel AI Gateway API key

### Setup

1. **Clone and install:**
   ```bash
   cd examples/vercel-ai-gateway-demo
   npm install
   ```

2. **Create `.env.local` file:**
   ```bash
   VERCEL_AI_GATEWAY_API_KEY=your_gateway_key_here
   HELICONE_API_KEY=your_helicone_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 🎮 How to Use the Demo

1. **Enter a debate topic** - Any controversial or fun topic (e.g., "pineapple on pizza")
2. **Select an SDK method** - Choose from the dropdown to test different integrations
3. **Start the debate** - Watch AI argue the "pro" side
4. **Counter or join** - Click "Counter!" for opposing arguments or add your own
5. **Monitor performance** - See response times for each message

## 📁 Project Structure

```
src/app/
├── api/
│   ├── chat/              # Vercel AI SDK (non-streaming)
│   ├── chat-stream/       # Vercel AI SDK (streaming)
│   ├── chat-openai/       # OpenAI SDK (streaming)
│   └── chat-openai-simple/# OpenAI SDK (non-streaming)
├── page.tsx               # Debate UI component
└── layout.tsx            # App layout
```

## 🔧 Integration Examples

### Vercel AI SDK with Gateway

```typescript
import { createGateway } from "@ai-sdk/gateway";

const gateway = createGateway({
  apiKey: process.env.VERCEL_AI_GATEWAY_API_KEY,
  baseURL: "https://vercel.helicone.ai/v1/ai",
  headers: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

// Use with generateText or streamText
const result = await generateText({
  model: gateway("anthropic/claude-3-5-sonnet"),
  prompt: "Your prompt here",
});
```

### OpenAI SDK with Gateway

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_API_KEY,
  baseURL: "https://vercel.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

// Works with any OpenAI-compatible model
const response = await openai.chat.completions.create({
  model: "anthropic/claude-3-5-sonnet",
  messages: [{ role: "user", content: "Your prompt" }],
});
```

## 📊 Monitoring in Helicone

After running the demo, visit your [Helicone dashboard](https://helicone.ai/dashboard) to see:

- Request logs with full details
- Response times and latency metrics
- Token usage and costs
- Error tracking and debugging info

## 🛠 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Feel free to submit issues or PRs to improve this demo!

## 📝 License

MIT
