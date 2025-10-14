"use client";

import { cn } from "@/lib/utils";

export type AiMessageProps = {
  role: "user" | "assistant" | "system";
  content: string;
  className?: string;
};

export function AiChatContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="text-sm text-muted-foreground">
        Powered by the Vercel AI SDK. Ask contextual questions about this deck and get tailored explanations.
      </div>
      {children}
    </div>
  );
}

export function AiMessageBubble({ role, content, className }: AiMessageProps) {
  const isUser = role === "user";
  const bubbleStyles = isUser
    ? "ml-auto bg-primary text-primary-foreground"
    : "mr-auto bg-muted text-foreground";

  return (
    <div
      className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ring-1 ring-border",
        bubbleStyles,
        className,
      )}
    >
      <p className="whitespace-pre-wrap break-words leading-relaxed">{content}</p>
    </div>
  );
}

export function AiMessageList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-md border border-border bg-background/80 p-3">
      {children}
    </div>
  );
}

export type AiInputProps = React.ComponentProps<"textarea"> & {
  isLoading?: boolean;
  onSubmit?: () => void;
};

export function AiInput({ className, isLoading, onSubmit, ...props }: AiInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className={cn(
          "min-h-[68px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        {...props}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Responses stay grounded in the deck&apos;s saved flashcards.</span>
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading || props.disabled}
          onClick={onSubmit}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
