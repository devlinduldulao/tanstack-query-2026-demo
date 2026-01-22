import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { experimental_streamedQuery as streamedQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Send, RefreshCw, AlertTriangle, Monitor, Edit3, HelpCircle, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/streamed-query")({
  component: StreamedQueryScreen,
});

// Server configuration
const SERVER_URL = "http://localhost:3001";

async function checkServerHealth() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

const samplePrompts = [
  { icon: <Monitor className="h-5 w-5" />, text: "Explain clean architecture", type: "technical" },
  { icon: <Edit3 className="h-5 w-5" />, text: "Create a story about a coding adventure", type: "creative" },
  { icon: <HelpCircle className="h-5 w-5" />, text: "What makes a great web app?", type: "general" },
  { icon: <Rocket className="h-5 w-5" />, text: "How does TanStack Query work?", type: "technical" },
];

type ChatMessage = {
  id: string;
  type: "user" | "assistant";
  content: string | string[];
  timestamp: Date;
  streaming?: boolean;
};

function StreamedQueryScreen() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [refetchMode, setRefetchMode] = useState<"reset" | "append" | "replace">("reset");
  const [connectionStatus, setConnectionStatus] = useState<string>("idle");

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: ["chat-stream"] });
    };
  }, [queryClient]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkServerHealth();
        setServerStatus(isHealthy ? "online" : "offline");
      } catch (error) {
        console.error(error);
        setServerStatus("offline");
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const chatQueryOptions = queryOptions({
    queryKey: ["chat-stream", currentPrompt],
    queryFn: streamedQuery({
      streamFn: async function* (context) {
        if (!currentPrompt) return; // Should not happen due to enabled check

        const response = await fetch(`${SERVER_URL}/stream-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: currentPrompt }),
          signal: context.signal,
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const parsed = JSON.parse(line.trim());
                  if (parsed.chunk) {
                    yield parsed.chunk;
                  }
                } catch (e) {
                  console.warn("JSON parse error:", e);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      },
      refetchMode: refetchMode,
    }),
    enabled: currentPrompt.length > 0 && serverStatus === "online",
    staleTime: Infinity,
    retry: false,
    gcTime: 0,
  });

  const chatQuery = useQuery(chatQueryOptions);

  const updateMessages = useCallback((data: string[], prompt: string, isFetching: boolean) => {
    setConnectionStatus(`Received ${data.length} chunks`);
    setMessages((prev) => {
      const messageId = `msg-${prompt}`;
      const existingMessageIndex = prev.findIndex((m) => m.id === messageId);

      if (existingMessageIndex >= 0) {
        const newMessages = [...prev];
        newMessages[existingMessageIndex] = {
          ...newMessages[existingMessageIndex],
          content: data,
          streaming: isFetching,
        };
        return newMessages;
      } else {
        return [
          ...prev,
          {
            id: messageId,
            type: "assistant" as const,
            content: data,
            timestamp: new Date(),
            streaming: isFetching,
          },
        ];
      }
    });
  }, []);

  useEffect(() => {
    if (chatQuery.data && currentPrompt) {
      updateMessages(chatQuery.data, currentPrompt, chatQuery.fetchStatus === "fetching");
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
      }
    }
  }, [chatQuery.data, chatQuery.fetchStatus, currentPrompt, updateMessages]);

  const connectionStatusText = useMemo(() => {
    if (chatQuery.status === "pending") return "Connecting...";
    if (chatQuery.fetchStatus === "fetching") return "Streaming...";
    if (chatQuery.error) return `Error: ${(chatQuery.error as Error).message}`;
    if (chatQuery.data) return `Complete - ${chatQuery.data.length} chunks`;
    return "idle";
  }, [chatQuery.status, chatQuery.fetchStatus, chatQuery.error, chatQuery.data]);

  useEffect(() => {
    setConnectionStatus(connectionStatusText);
  }, [connectionStatusText]);

  const handleSendMessage = () => {
    if (userInput.trim() && serverStatus === "online") {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        content: userInput,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setCurrentPrompt(userInput);
      setUserInput("");
    }
  };

  const handleSamplePrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleRefetch = () => {
    if (currentPrompt) {
      chatQuery.refetch();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentPrompt("");
    setUserInput("");
    queryClient.removeQueries({ queryKey: ["chat-stream"] });
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col gap-4 p-4">
      {/* Header */}
      <div className="bg-card flex items-center justify-between rounded-xl border p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Streamed Query</h1>
          <p className="text-muted-foreground text-sm">
            TanStack Query{" "}
            <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">experimental_streamedQuery</span> Demo
          </p>
        </div>
        <div className="bg-muted/50 flex items-center gap-3 rounded-full border px-3 py-1.5">
          <div
            className={cn(
              "h-2.5 w-2.5 animate-pulse rounded-full",
              serverStatus === "online"
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                : serverStatus === "offline"
                  ? "bg-red-500"
                  : "bg-yellow-500",
            )}
          />
          <span className="text-sm font-medium">
            {serverStatus === "online"
              ? "System Online"
              : serverStatus === "offline"
                ? "System Offline"
                : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Server Status Alert */}
      {serverStatus === "offline" && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive flex items-center gap-3 rounded-lg border p-4">
          <AlertTriangle className="h-5 w-5" />
          <div className="space-y-1">
            <div className="font-semibold">Connection Failed</div>
            <div className="text-xs opacity-90">Please ensure the streaming server is running on port 3001.</div>
          </div>
        </div>
      )}

      {/* Refetch Mode */}
      <Card>
        <CardContent className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Strategy:</span>
            <div className="bg-muted flex rounded-lg p-1">
              {(["reset", "append", "replace"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRefetchMode(mode)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-all",
                    refetchMode === mode
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <span className="text-muted-foreground text-xs italic">
            {refetchMode === "reset" && "Reset: Clears previous data before fetching."}
            {refetchMode === "append" && "Append: Adds new chunks to existing history."}
            {refetchMode === "replace" && "Replace: Swaps entire content on completion."}
          </span>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="border-muted/60 flex flex-1 flex-col overflow-hidden shadow-md">
        <ScrollArea className="flex-1 p-4" viewportRef={scrollViewportRef}>
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center space-y-6 p-8 text-center opacity-60">
              <div className="bg-muted/50 rounded-full p-4">
                <Monitor className="text-muted-foreground h-8 w-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-semibold">Ready to Stream</h3>
                <p className="text-muted-foreground text-sm">
                  This demo uses AsyncIterables to stream responses byte-by-byte from the server.
                </p>
              </div>
              <div className="grid w-full max-w-lg grid-cols-1 gap-3 md:grid-cols-2">
                {samplePrompts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-background/50 hover:bg-muted/80 h-auto justify-start gap-3 py-3"
                    onClick={() => handleSamplePrompt(sample.text)}
                    disabled={serverStatus !== "online"}
                  >
                    {sample.icon}
                    <span className="text-xs">{sample.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex w-full gap-3", message.type === "user" ? "justify-end" : "justify-start")}
              >
                {message.type === "assistant" && (
                  <div className="bg-primary/10 border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                    <Rocket className="text-primary h-4 w-4" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4 shadow-sm",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/50 border-border rounded-tl-sm border",
                  )}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {Array.isArray(message.content) ? message.content.join("") : message.content}
                    {message.streaming && (
                      <span className="bg-primary/50 ml-1 inline-block h-4 w-1.5 animate-pulse align-middle" />
                    )}
                  </div>

                  {message.type === "assistant" && !message.streaming && (
                    <div className="mt-3 flex items-center justify-between gap-4 border-t pt-2">
                      <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        {Array.isArray(message.content) ? message.content.length : 0} chunks received
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-background h-6 w-6"
                        onClick={handleRefetch}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {message.type === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                    <span className="text-xs font-bold">ME</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="bg-muted/20 border-t p-4 backdrop-blur-sm">
          <div className="relative flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={serverStatus === "online" ? "Type your prompt here..." : "Server unavailable"}
              disabled={chatQuery.fetchStatus === "fetching" || serverStatus !== "online"}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="bg-background pr-12 shadow-sm"
            />
            <div className="absolute top-1 right-1">
              {userInput.trim() ? (
                <Button
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={chatQuery.fetchStatus === "fetching"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetChat} title="Reset Chat">
                  <RefreshCw className="text-muted-foreground h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="text-muted-foreground mt-3 flex items-center justify-between text-[10px] font-medium tracking-widest uppercase">
            <div className="flex gap-4">
              <span>Status: {chatQuery.status}</span>
              <span>State: {chatQuery.fetchStatus}</span>
            </div>
            <span className={cn("transition-colors", chatQuery.fetchStatus === "fetching" ? "text-primary" : "")}>
              {connectionStatus}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
