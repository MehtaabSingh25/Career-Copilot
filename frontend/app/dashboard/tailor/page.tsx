"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getResumes, tailorResume, type ResumeRecord, type TailoredResumeDraft } from "@/lib/api";

const panelClass = "rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900";
const inputClass = "mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export default function TailorResumePage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [draft, setDraft] = useState<TailoredResumeDraft | null>(null);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => {
        setResumes(result.data);
        setResumeId(result.data[0]?._id ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load resumes."))
      .finally(() => setLoadingResumes(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDraft(null);
    setGenerating(true);
    try {
      const result = await tailorResume(resumeId, jobDescription);
      setDraft(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not tailor this resume.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="AI Career Copilot"
        title="Tailor your resume"
        description="Adapt your resume to a specific job description while keeping every claim grounded in your existing experience. Review the AI draft before using it."
      />

      {loadingResumes ? (
        <EmptyState title="Loading resumes" description="Fetching your uploaded resumes." />
      ) : error && resumes.length === 0 ? (
        <EmptyState title="Could not load resumes" description={error} actionHref="/dashboard/upload" actionLabel="Upload Resume" />
      ) : resumes.length === 0 ? (
        <EmptyState title="Upload a resume first" description="You need an uploaded resume before you can tailor it to a job." actionHref="/dashboard/upload" actionLabel="Upload Resume" />
      ) : (
        <>
          <form onSubmit={handleSubmit} className={`${panelClass} space-y-5`}>
            <div>
              <label htmlFor="resume" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Resume to tailor</label>
              <select id="resume" value={resumeId} onChange={(event) => setResumeId(event.target.value)} required className={inputClass}>
                {resumes.map((resume) => <option key={resume._id} value={resume._id}>{resume.title || resume.originalName}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="job-description" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Job description</label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                minLength={100}
                maxLength={20000}
                rows={9}
                required
                placeholder="Paste the complete job description here (at least 100 characters)…"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{jobDescription.length.toLocaleString()} / 20,000 characters · Minimum 100</p>
            </div>
            {error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
            <button type="submit" disabled={generating || !resumeId || jobDescription.trim().length < 100} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white">
              {generating ? "Tailoring resume…" : "Generate tailored draft"}
            </button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">AI can make mistakes. Verify every section and do not include skills or achievements you cannot substantiate.</p>
          </form>

          {draft ? (
            <section aria-live="polite" className="mt-8 space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Your tailored draft</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Review and edit this content in your resume document before sending it to an employer.</p>
              </div>
              <DraftPanel title="Professional Summary" items={[draft.professionalSummary]} />
              <DraftPanel title="Relevant Skills" items={draft.skills} />
              <DraftPanel title="Experience Bullets" items={draft.experienceBullets} />
              <DraftPanel title="Project Bullets" items={draft.projectBullets} />
              <DraftPanel title="Supported Job Keywords" items={draft.keywords} />
              <DraftPanel title="What Changed" items={draft.changeNotes} />
              <DraftPanel title="Review These Cautions" items={draft.cautions} caution />
            </section>
          ) : null}
        </>
      )}
    </>
  );
}

function DraftPanel({ title, items, caution = false }: { title: string; items: string[]; caution?: boolean }) {
  return (
    <div className={panelClass}>
      <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">{title}</h3>
      {items.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">No items returned for this section.</p>
      )}
      {caution ? <p className="mt-4 text-xs text-amber-700 dark:text-amber-300">Check these points carefully. The AI must not invent experience or qualifications.</p> : null}
    </div>
  );
}
