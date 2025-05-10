"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";
import { ArrowUp } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/app/ai-response.css";
interface Props {
  user: User | null;
}
const AskAIButton = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const handleOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    console.log("Submitted");
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [
        ...prev,
        typeof response === "string" ? response : JSON.stringify(response),
      ]);

      setTimeout(scrollToBottom, 100);
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <Dialog defaultOpen={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ask AI About Your Notes</DialogTitle>
          <DialogDescription>
            Our AI can answer questions about all your notes
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-8">
          {questions.map((question, index) => (
            <div key={index}>
              <p className="ml-auto w-fit max-w-[60%] text-sm text-muted-foreground py-1 rounded-md px-2 bg-muted">
                {question}
              </p>
              {responses[index] && (
                <p
                  className="bot-response text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: responses[index] }}
                />
              )}
            </div>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>

        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes..."
            className="resize-none rounded-none border-none bg-transparent p-0 shadow-none placeholder:text-muted-foreground focus-visible:ring-offset-0 focus-visible:ring-0"
            style={{
              minHeight: "0",
              lineHeight: "normal",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button className="rounded-full ml-auto size-8">
            <ArrowUp className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskAIButton;
