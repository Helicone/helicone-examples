# Vercel AI Gateway Request Flow

## URL Transformation

When using `createGateway()`, the URL is transformed as follows:

```
Base URL: https://vercel.staging.hconeai.com/v1/ai
         ↓
Final URL: https://vercel.staging.hconeai.com/v1/ai/language-model
```

## Request Flow Diagram

```
┌─────────────┐
│  Your App   │
│             │
│ generateText│
└──────┬──────┘
       │
       │ 1. Call with gateway(modelId)
       ↓
┌─────────────────────────┐
│   Gateway Provider      │
│                         │
│ • Adds auth headers     │
│ • Adds protocol headers │
│ • Adds model headers    │
└──────────┬──────────────┘
           │
           │ 2. POST to /language-model
           ↓
┌─────────────────────────┐
│   Gateway Service       │
│ (Vercel/Helicone)       │
│                         │
│ • Routes by model ID    │
│ • Handles auth          │
│ • Tracks usage          │
└──────────┬──────────────┘
           │
           │ 3. Forward to provider
           ↓
┌─────────────────────────┐
│   AI Provider           │
│ (Anthropic, OpenAI,    │
│  Google, etc.)          │
└─────────────────────────┘
```

## Headers Added by Gateway

```javascript
{
  // Authentication
  "Authorization": "Bearer [API_KEY or OIDC_TOKEN]",
  "ai-gateway-auth-method": "api-key" | "oidc",
  
  // Protocol
  "ai-gateway-protocol-version": "0.0.1",
  
  // Model Configuration
  "ai-language-model-specification-version": "2",
  "ai-language-model-id": "anthropic/claude-3-5-sonnet",
  "ai-language-model-streaming": "true" | "false",
  
  // Observability (if in Vercel environment)
  "ai-o11y-deployment-id": "[VERCEL_DEPLOYMENT_ID]",
  "ai-o11y-environment": "[VERCEL_ENV]",
  "ai-o11y-region": "[VERCEL_REGION]",
  "ai-o11y-request-id": "[Request ID]",
  
  // Custom headers (from your config)
  "Helicone-Auth": "Bearer [HELICONE_API_KEY]"
}
```

## Key Components

1. **GatewayLanguageModel**: Handles text generation requests
2. **GatewayEmbeddingModel**: Handles embedding requests
3. **Authentication**: Supports both API keys and OIDC tokens
4. **Error Handling**: Custom error types for different failure scenarios
5. **Metadata Caching**: Caches available models for 5 minutes by default