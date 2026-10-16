"use client";

import { FormEvent, useEffect, useState } from "react";
import { getResumes, ResumeRecord } from "@/lib/api";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatSummary = {
  _id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};
type ChatConversation = {
  _id: string;
  title: string;
  resume?: string | null;
  messages: ChatMessage[];
};

const panelClass =
  "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-5";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("resume_ai_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function requestChat<T>(path = "", init?: RequestInit): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/ai/chat${path}`, {
    ...init,
    headers: { ...authHeaders(), ...init?.headers },
  });
  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ?? "The career assistant could not complete your request.",
    );
  }
  return result.data as T;
}

export default function CareerChatPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatSummary[]>([]);
  const [conversationId, setConversationId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      const history = await requestChat<ChatSummary[]>();
      setConversations(history);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load chat history.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    let active = true;
    getResumes()
      .then((result) => {
        if (active) setResumes(result.data);
      })
      .catch(() => {
        if (active)
          setError(
            "Could not load your resumes. You can still ask a general career question.",
          );
      })
      .finally(() => {
        if (active) setLoadingResumes(false);
      });
    queueMicrotask(() => {
      void loadHistory();
    });
    return () => {
      active = false;
    };
  }, []);

  function startNewChat() {
    setConversationId("");
    setMessages([]);
    setQuestion("");
    setError("");
  }

  async function openConversation(id: string) {
    if (openingConversation || sending) return;
    setOpeningConversation(true);
    setError("");
    try {
      const conversation = await requestChat<ChatConversation>(
        `/${encodeURIComponent(id)}`,
      );
      setConversationId(conversation._id);
      setMessages(conversation.messages ?? []);
      setResumeId(conversation.resume ?? "");
      setQuestion("");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not open this conversation.",
      );
    } finally {
      setOpeningConversation(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 3 || sending) return;

    setError("");
    setMessages((current) => [
      ...current,
      { role: "user", content: trimmedQuestion },
    ]);
    setQuestion("");
    setSending(true);

    try {
      const result = await requestChat<{
        answer: string;
        conversationId: string;
      }>("", {
        method: "POST",
        body: JSON.stringify({
          question: trimmedQuestion,
          ...(resumeId ? { resumeId } : {}),
          ...(conversationId ? { conversationId } : {}),
        }),
      });
      setConversationId(result.conversationId);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.answer },
      ]);
      await loadHistory();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The career assistant could not answer right now.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-blue-600">
          CAREER COPILOT
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Career Chat
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Ask for practical help with your resume, interviews, job search, and
          professional development. Your conversations are saved privately to
          your account.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className={`${panelClass} h-fit`} aria-label="Chat history">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
              Previous chats
            </h2>
            <button
              type="button"
              onClick={startNewChat}
              disabled={sending || openingConversation}
              className="rounded-md bg-zinc-950 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"
            >
              New chat
            </button>
          </div>
          {loadingHistory ? (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Loading chat history…
            </p>
          ) : conversations.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Your saved conversations will appear here after you ask your first
              question.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {conversations.map((conversation) => (
                <li key={conversation._id}>
                  <button
                    type="button"
                    onClick={() => void openConversation(conversation._id)}
                    disabled={sending || openingConversation}
                    aria-current={
                      conversationId === conversation._id ? "page" : undefined
                    }
                    className={`w-full rounded-lg border px-3 py-3 text-left transition disabled:opacity-50 ${conversationId === conversation._id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"}`}
                  >
                    <span className="block line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {conversation.title}
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                      {conversation.messageCount} messages ·{" "}
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="min-w-0 space-y-5">
          <section className={panelClass}>
            <label
              htmlFor="resume-context"
              className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Resume context (optional)
            </label>
            <select
              id="resume-context"
              value={resumeId}
              onChange={(event) => setResumeId(event.target.value)}
              disabled={loadingResumes || sending || openingConversation}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option value="">General career question — no resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title || resume.originalName}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              When selected, your resume helps personalize the guidance. Verify
              suggestions before using them.
            </p>
          </section>

          <section
            aria-live="polite"
            className={`${panelClass} min-h-72 space-y-4`}
          >
            {openingConversation ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Opening conversation…
              </p>
            ) : null}
            {messages.length === 0 ? (
              <div className="py-12 text-center">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  What would you like help with?
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Ask about interview preparation, improving your resume,
                  finding skill gaps, or planning your next career step.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`rounded-lg p-4 ${message.role === "user" ? "ml-4 bg-zinc-100 dark:bg-zinc-800" : "mr-4 border border-zinc-200 dark:border-zinc-800"}`}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {message.role === "user" ? "You" : "Career Copilot"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {message.content}
                  </p>
                </article>
              ))
            )}
            {sending ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Career Copilot is preparing an answer…
              </p>
            ) : null}
            {error ? (
              <p
                role="alert"
                className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
              >
                {error}
              </p>
            ) : null}
          </section>

          <form onSubmit={handleSubmit} className={`${panelClass} space-y-3`}>
            <label
              htmlFor="career-question"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Your question
            </label>
            <textarea
              id="career-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: How can I explain my project clearly in an interview?"
              rows={4}
              minLength={3}
              maxLength={2000}
              required
              disabled={sending || openingConversation}
              className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {question.length}/2000 characters
              </span>
              <button
                type="submit"
                disabled={
                  sending || openingConversation || question.trim().length < 3
                }
                className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"
              >
                {sending ? "Thinking…" : "Ask Career Copilot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
