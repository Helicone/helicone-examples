"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "pro" | "con" | "user";
  content: string;
  timestamp: number;
  responseTime?: number;
};

type SDKOption = {
  id: string;
  name: string;
  endpoint: string;
  stream: boolean;
};

const SDK_OPTIONS: SDKOption[] = [
  {
    id: "vercel-ai",
    name: "Vercel AI SDK",
    endpoint: "/api/chat",
    stream: false,
  },
  {
    id: "vercel-ai-stream",
    name: "Vercel AI SDK (Stream)",
    endpoint: "/api/chat-stream",
    stream: true,
  },
  {
    id: "openai",
    name: "OpenAI SDK",
    endpoint: "/api/chat-openai-simple",
    stream: false,
  },
  {
    id: "openai-stream",
    name: "OpenAI SDK (Stream)",
    endpoint: "/api/chat-openai",
    stream: true,
  },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSDK, setSelectedSDK] = useState<SDKOption>(SDK_OPTIONS[0]);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generatePrompt = (
    role: "pro" | "con",
    topic: string,
    history: Message[]
  ) => {
    const stance = role === "pro" ? "in favor of" : "against";
    const contextMessages = history
      .slice(-3)
      .map(
        (m) =>
          `${m.role === "pro" ? "Pro" : m.role === "con" ? "Con" : "User"}: ${
            m.content
          }`
      )
      .join("\n");

    return `You are debating ${stance} "${topic}". 
${contextMessages ? `Recent arguments:\n${contextMessages}\n\n` : ""}
Make a concise, compelling argument (2-3 sentences max). Be direct and persuasive.`;
  };

  const handleStart = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setHasStarted(true);
    const startTime = Date.now();

    try {
      const response = await fetch(selectedSDK.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: generatePrompt("pro", topic, []),
            },
          ],
        }),
      });

      let content = "";

      if (selectedSDK.stream) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) content += data.content;
                if (data.type === "text") content += data.text;
              } catch {}
            }
          }
        }
      } else {
        const data = await response.json();
        console.log("Non-streaming response data:", data);
        content = data.text || data.message || JSON.stringify(data);
      }

      setMessages([
        {
          role: "pro",
          content,
          timestamp: Date.now(),
          responseTime: Date.now() - startTime,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCounter = async () => {
    if (messages.length === 0) return;

    setIsLoading(true);
    const startTime = Date.now();
    const nextRole =
      messages[messages.length - 1].role === "pro" ? "con" : "pro";

    try {
      const response = await fetch(selectedSDK.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: generatePrompt(nextRole, topic, messages),
            },
          ],
        }),
      });

      let content = "";

      if (selectedSDK.stream) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) content += data.content;
                if (data.type === "text") content += data.text;
              } catch {}
            }
          }
        }
      } else {
        const data = await response.json();
        console.log("Non-streaming response data:", data);
        content = data.text || data.message || JSON.stringify(data);
      }

      setMessages([
        ...messages,
        {
          role: nextRole,
          content,
          timestamp: Date.now(),
          responseTime: Date.now() - startTime,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setMessages([
      ...messages,
      {
        role: "user",
        content: userInput,
        timestamp: Date.now(),
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="max-w-4xl w-full mx-auto p-4 flex flex-col h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Vercel AI Gateway Demo: AI Debate Simulator
          </h1>
          <p className="text-gray-700 text-sm">
            Test different Vercel AI Gateway integration methods while watching AI debate both sides of any topic!
          </p>

          {!hasStarted ? (
            <div className="space-y-3 mt-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Enter a debate topic (e.g., 'pineapple on pizza')"
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />

              <div className="flex gap-3 items-center">
                <select
                  value={selectedSDK.id}
                  onChange={(e) =>
                    setSelectedSDK(
                      SDK_OPTIONS.find((opt) => opt.id === e.target.value)!
                    )
                  }
                  className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {SDK_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleStart}
                  disabled={!topic.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  Start Debate
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Topic: {topic}
                </h2>
                <select
                  value={selectedSDK.id}
                  onChange={(e) =>
                    setSelectedSDK(
                      SDK_OPTIONS.find((opt) => opt.id === e.target.value)!
                    )
                  }
                  className="px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {SDK_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {hasStarted && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === "pro"
                        ? "bg-green-50 border-l-4 border-green-600"
                        : message.role === "con"
                        ? "bg-red-50 border-l-4 border-red-600"
                        : "bg-blue-50 border-l-4 border-blue-600"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`font-semibold text-xs uppercase tracking-wide ${
                          message.role === "pro"
                            ? "text-green-800"
                            : message.role === "con"
                            ? "text-red-800"
                            : "text-blue-800"
                        }`}
                      >
                        {message.role === "pro"
                          ? "PRO"
                          : message.role === "con"
                          ? "CON"
                          : "YOU"}
                      </span>
                      {message.responseTime && (
                        <span className="text-xs text-gray-600 font-medium">
                          {message.responseTime}ms
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-center py-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <form onSubmit={handleUserSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Add your own argument..."
                  className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleCounter}
                  disabled={isLoading || messages.length === 0}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  Counter!
                </button>
              </form>

              <div className="mt-3 text-center text-xs text-gray-600">
                Powered by Vercel AI Gateway + Helicone • Using: {selectedSDK.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
