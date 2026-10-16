"use client";

import { FormEvent, useEffect, useState } from "react";
import { getResumes, ResumeRecord } from "@/lib/api";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function CareerChatPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getResumes()
      .then((result) => {
        if (active) setResumes(result.data);
      })
      .catch(() => {
        if (active) setError("Could not load your resumes. You can still ask a general career question.");
      })
      .finally(() => {
        if (active) setLoadingResumes(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 3 || sending) return;

    setError("");
    setMessages((current) => [...current, { role: "user", content: trimmedQuestion }]);
    setQuestion("");
    setSending(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("resume_ai_token");
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: trimmedQuestion, ...(resumeId ? { resumeId } : {}) }),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message ?? "The career assistant could not answer right now.");
      }
      setMessages((current) => [...current, { role: "assistant", content: result.data.answer }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The career assistant could not answer right now.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-blue-600">CAREER COPILOT</p>
        <h1 className="text-3xl font-semibold tracking-tight">Career Chat</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Ask for practical help with your resume, interviews, job search, and professional development.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-4 md:p-6">
        <label htmlFor="resume-context" className="mb-2 block text-sm font-medium">Resume context (optional)</label>
        <select
          id="resume-context"
          value={resumeId}
          onChange={(event) => setResumeId(event.target.value)}
          disabled={loadingResumes || sending}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">General career question — no resume</option>
          {resumes.map((resume) => (
            <option key={resume._id} value={resume._id}>{resume.title || resume.originalName}</option>
          ))}
        </select>
        <p className="mt-2 text-xs text-muted-foreground">
          When selected, your resume is used only to help answer this question. Check suggestions for accuracy before using them.
        </p>
      </section>

      <section aria-live="polite" className="min-h-64 space-y-4 rounded-xl border bg-card p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="py-10 text-center">
            <h2 className="text-lg font-medium">What would you like help with?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              Try asking how to prepare for an interview, improve a resume summary, or plan your next career step.
            </p>
          </div>
        ) : messages.map((message, index) => (
          <article key={`${message.role}-${index}`} className={`rounded-lg p-4 ${message.role === "user" ? "ml-6 bg-muted" : "mr-6 border"}`}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {message.role === "user" ? "You" : "Career Copilot"}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
          </article>
        ))}
        {sending && <p className="text-sm text-muted-foreground">Career Copilot is preparing an answer…</p>}
        {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      </section>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border bg-card p-4 md:p-6">
        <label htmlFor="career-question" className="block text-sm font-medium">Your question</label>
        <textarea
          id="career-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="For example: How can I explain my project clearly in an interview?"
          rows={4}
          maxLength={2000}
          required
          disabled={sending}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{question.length}/2000 characters</span>
          <button
            type="submit"
            disabled={sending || question.trim().length < 3}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Thinking…" : "Ask Career Copilot"}
          </button>
        </div>
      </form>
    </main>
  );
}
