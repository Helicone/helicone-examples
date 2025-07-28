# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo containing Helicone integration examples. The main project is currently located at:
- `examples/vercel-ai-gateway-demo/` - Next.js application demonstrating Vercel AI Gateway with Helicone

## Development Commands

For the Next.js AI Gateway example:

```bash
# Navigate to the example
cd examples/vercel-ai-gateway-demo

# Install dependencies
npm install

# Run development server
npm run dev --turbopack

# Build production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

### AI Gateway Integration
The Next.js example demonstrates multiple approaches to integrate AI services through Helicone's gateway:

1. **Vercel AI SDK Integration** (`src/app/api/chat/route.ts`):
   - Uses `@ai-sdk/gateway` to create a gateway client
   - Configures with Helicone baseURL and authentication headers
   - Supports both streaming and non-streaming responses

2. **OpenAI SDK Integration** (`src/app/api/chat-openai/route.ts`):
   - Direct OpenAI client configuration with Helicone proxy
   - Implements streaming responses with Server-Sent Events format
   - Supports both GET and POST methods

3. **Gateway Flow** (documented in `GATEWAY_FLOW.md`):
   - Requests flow through: Your App → Gateway Provider → Gateway Service (Helicone) → AI Provider
   - Gateway adds authentication, protocol, and observability headers
   - Model routing is handled by the gateway based on model ID

### Frontend Architecture
- React client (`src/app/page.tsx`) implements an AI debate simulator
- Supports multiple SDK options with streaming/non-streaming modes
- Real-time message display with response time tracking

## Environment Variables Required

```bash
VERCEL_AI_GATEWAY_API_KEY=<your-gateway-api-key>
HELICONE_API_KEY=<your-helicone-api-key>
```

## Key Technical Details

- TypeScript with strict mode enabled
- Next.js 15.4.4 with App Router
- Tailwind CSS for styling
- Path alias `@/*` configured for `src/*` imports