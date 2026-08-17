import { useCallback, useRef, useState } from "react";
import type { GenerateFormInput } from "@/lib/validations/generate";

type GenerateStatus = "idle" | "streaming" | "done" | "error";

interface GenerateState {
  status: GenerateStatus;
  title: string;
  content: string;
  error: string | null;
  itemId: string | null;
}

const initialState: GenerateState = {
  status: "idle",
  title: "",
  content: "",
  error: null,
  itemId: null,
};

type StreamEvent =
  | { type: "title"; title: string }
  | { type: "chunk"; text: string }
  | { type: "done"; id: string }
  | { type: "error"; message: string };

export function useGenerate() {
  const [state, setState] = useState<GenerateState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => setState(initialState), []);

  const generate = useCallback(async (input: GenerateFormInput) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: "streaming", title: "", content: "", error: null, itemId: null });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        setState((prev) => ({
          ...prev,
          status: "error",
          error: data?.error ?? "Generation failed. Please try again.",
        }));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as StreamEvent;

          if (event.type === "title") {
            setState((prev) => ({ ...prev, title: event.title }));
          } else if (event.type === "chunk") {
            setState((prev) => ({ ...prev, content: prev.content + event.text }));
          } else if (event.type === "done") {
            setState((prev) => ({ ...prev, status: "done", itemId: event.id }));
          } else if (event.type === "error") {
            setState((prev) => ({ ...prev, status: "error", error: event.message }));
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Generation failed. Please try again.",
      }));
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  return { ...state, generate, cancel, reset };
}
