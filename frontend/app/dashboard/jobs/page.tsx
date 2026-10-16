"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  createJobMatch,
  getJobMatch,
  getJobMatches,
  getResumes,
  type JobMatchRecord,
  type JobMatchSummary,
  type ResumeRecord,
} from "@/lib/api";

const statusLabels = {
  match: "Matched",
  partial: "Partially matched",
  missing: "Missing",
} as const;

const statusClasses = {
  match:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  partial:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  missing:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200",
} as const;

export default function JobMatcherPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JobMatchRecord | null>(null);
  const [matches, setMatches] = useState<JobMatchSummary[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [openingMatchId, setOpeningMatchId] = useState("");

  const loadMatchHistory = useCallback(async () => {
    try {
      const response = await getJobMatches();
      setMatches(response.data);
      setHistoryError("");
    } catch (err) {
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Could not load saved job matches.",
      );
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    getResumes()
      .then(({ data }) => {
        setResumes(data);
        if (data.length) setResumeId(data[0]._id);
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Could not load resumes.",
        ),
      )
      .finally(() => setLoadingResumes(false));
    queueMicrotask(() => {
      void loadMatchHistory();
    });
  }, [loadMatchHistory]);

  async function openSavedMatch(matchId: string) {
    setOpeningMatchId(matchId);
    setHistoryError("");
    setError("");
    try {
      const response = await getJobMatch(matchId);
      setResult(response.data);
      void loadMatchHistory();
    } catch (err) {
      setHistoryError(
        err instanceof Error ? err.message : "Could not open this saved match.",
      );
    } finally {
      setOpeningMatchId("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!resumeId) {
      setError("Please upload a resume before matching it to a job.");
      return;
    }
    if (jobDescription.trim().length < 100) {
      setError("Please enter a job description with at least 100 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createJobMatch({
        resumeId,
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        jobDescription: jobDescription.trim(),
      });
      setResult(response.data);
      void loadMatchHistory();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Job matching failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Job Matcher"
        description="Compare your resume with a job description and identify strengths and skill gaps."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Match a job
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Choose a resume and add the role details.
              </p>
            </div>
          </div>

          {loadingResumes ? (
            <EmptyState
              title="Loading resumes"
              description="Getting your uploaded resumes."
            />
          ) : resumes.length === 0 ? (
            <EmptyState
              title="No resumes available"
              description="Upload a PDF resume first, then return here to match it against a job description."
              actionHref="/dashboard/upload"
              actionLabel="Upload Resume"
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="resumeId"
                  className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Resume
                </label>
                <select
                  id="resumeId"
                  value={resumeId}
                  onChange={(event) => setResumeId(event.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.title || resume.originalName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Job title
                </label>
                <input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  required
                  maxLength={120}
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Company{" "}
                  <span className="font-normal text-zinc-500">(optional)</span>
                </label>
                <input
                  id="company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  maxLength={120}
                  placeholder="Company name"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label
                    htmlFor="jobDescription"
                    className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Job description
                  </label>
                  <span
                    className={`text-xs ${jobDescription.length < 100 ? "text-zinc-500" : "text-emerald-700 dark:text-emerald-300"}`}
                  >
                    {jobDescription.length}/20,000
                  </span>
                </div>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(event) =>
                    setJobDescription(event.target.value.slice(0, 20000))
                  }
                  required
                  minLength={100}
                  rows={8}
                  placeholder="Paste the full job description, including responsibilities and required skills…"
                  className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Enter at least 100 characters for a useful comparison.
                </p>
              </div>
              {error ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
                >
                  <CircleAlert size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
              <button
                type="submit"
                disabled={submitting || !resumes.length}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />{" "}
                    Analyzing match…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Analyze job match
                  </>
                )}
              </button>
              {submitting ? (
                <p className="text-center text-xs text-zinc-500">
                  This can take a little while while AI reviews the resume and
                  job requirements.
                </p>
              ) : null}
            </form>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 xl:col-span-2 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                <Clock3 size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  Saved job matches
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Open a previous report to review its requirements and
                  recommendations.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoadingMatches(true);
                void loadMatchHistory();
              }}
              disabled={loadingMatches}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <RefreshCw
                size={15}
                className={loadingMatches ? "animate-spin" : ""}
              />{" "}
              Refresh
            </button>
          </div>
          {historyError ? (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
            >
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <span>{historyError}</span>
            </div>
          ) : null}
          {loadingMatches ? (
            <p className="py-5 text-sm text-zinc-500">Loading saved matches…</p>
          ) : matches.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
              No saved job matches yet. Analyze a job description to build your
              history.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((match) => (
                <button
                  type="button"
                  key={match._id}
                  onClick={() => void openSavedMatch(match._id)}
                  disabled={Boolean(openingMatchId)}
                  className={`rounded-lg border p-4 text-left transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 ${result?._id === match._id ? "border-zinc-500 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-800"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                        {match.jobTitle}
                      </p>
                      <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {match.company || "Company not specified"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-sm font-bold tabular-nums text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {match.matchScore}%
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                    {match.summary}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </p>
                  {openingMatchId === match._id ? (
                    <span className="mt-2 inline-flex items-center gap-2 text-xs text-zinc-500">
                      <LoaderCircle size={14} className="animate-spin" />{" "}
                      Opening report…
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </section>

        <section aria-live="polite" className="min-w-0">
          {!result ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                <Sparkles size={22} />
              </div>
              <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Your match report will appear here
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Submit a job description to see your match score, evidence from
                your resume, and areas to improve.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Match report</p>
                    <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                      {result.jobTitle}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {result.company || "Company not specified"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-100 px-4 py-3 text-center dark:bg-zinc-800">
                    <p className="text-3xl font-bold tabular-nums text-zinc-950 dark:text-zinc-50">
                      {result.matchScore}%
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Match score
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {result.summary}
                </p>
                <p className="mt-3 text-xs text-zinc-500">
                  AI-generated estimate based on the selected resume and
                  supplied job description; it is not a hiring prediction.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  Requirement breakdown{" "}
                  <span className="font-normal text-zinc-500">
                    ({result.requirements.length})
                  </span>
                </h3>
                <div className="mt-4 space-y-3">
                  {result.requirements.map((requirement, index) => (
                    <article
                      key={`${requirement.name}-${index}`}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {requirement.name}
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[requirement.status]}`}
                        >
                          {statusLabels[requirement.status]}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                          {requirement.importance === "required"
                            ? "Required"
                            : "Preferred"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-zinc-700 dark:text-zinc-300">
                        {requirement.explanation}
                      </p>
                      {requirement.evidence ? (
                        <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium">Resume evidence:</span>{" "}
                          {requirement.evidence}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>

              {result.recommendations.length ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                  <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                    Recommended next steps
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {result.recommendations.map((recommendation, index) => (
                      <li
                        key={`${index}-${recommendation}`}
                        className="flex items-start gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-1 shrink-0 text-emerald-600"
                        />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
