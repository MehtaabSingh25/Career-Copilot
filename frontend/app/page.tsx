import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  FileText,
  GitCompareArrows,
  MessageCircle,
  Target,
  Upload,
} from "lucide-react";

const features = [
  {
    title: "AI Resume Analysis",
    description: "Review resume quality, ATS readiness, strengths, weaknesses, and actionable improvement suggestions.",
    icon: FileSearch,
  },
  {
    title: "Job Matching",
    description: "Compare your resume with a job description and understand which requirements match or need attention.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Resume Tailoring",
    description: "Create a job-specific draft of your summary, skills, and experience bullets without inventing qualifications.",
    icon: FileText,
  },
  {
    title: "Career Copilot Chat",
    description: "Ask career, interview, and job-search questions, optionally using an uploaded resume as context.",
    icon: MessageCircle,
  },
  {
    title: "Compare & Track",
    description: "Keep a history of your work and compare resume versions as you improve them.",
    icon: GitCompareArrows,
  },
  {
    title: "Skills & Roadmap",
    description: "Identify skills to strengthen and turn career goals into practical next steps.",
    icon: Target,
  },
];

const workflow = [
  "Upload a PDF resume and review the AI analysis.",
  "Match it to a target role and identify gaps.",
  "Tailor a draft and ask Career Copilot for guidance.",
  "Track changes, compare versions, and plan your next steps.",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-950 text-sm text-white">CC</span>
            Career Copilot
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 sm:block">Log in</Link>
            <Link href="/register" className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Get started</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Your AI-powered career workspace
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">From resume to your next opportunity.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
            Career Copilot brings resume analysis, job matching, tailored resume drafts, and conversational career guidance into one place—so you can make your next application with more clarity.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 font-medium text-white hover:bg-zinc-800">
              Start with your resume <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 px-6 font-medium text-zinc-800 hover:bg-zinc-100">Log in</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600">
            {["Resume insights", "Role-specific drafts", "Practical career guidance"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" />{item}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-500">YOUR CAREER WORKFLOW</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">One place to move forward</h2>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-zinc-200"><BarChart3 size={22} /></div>
          </div>
          <div className="mt-6 space-y-3">
            {workflow.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-950 text-sm font-semibold text-white">{index + 1}</span>
                <p className="self-center text-sm leading-6 text-zinc-700">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-700">
            <Upload size={18} className="shrink-0" /> Start by uploading a PDF resume, then choose the tool that fits your next step.
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Everything works together</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">More than a resume checker</h2>
            <p className="mt-4 leading-7 text-zinc-600">Use focused tools across the application process—from understanding your current resume to preparing for a specific opportunity.</p>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-zinc-100"><Icon size={22} /></div>
                  <h3 className="mt-5 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center md:px-8 md:py-20">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Make your next application more intentional.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-600">Get evidence-based suggestions from your resume and the role you are targeting. Review AI-generated drafts before using them.</p>
        </div>
        <Link href="/register" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 font-medium text-white hover:bg-zinc-800">Create your account <ArrowRight size={18} /></Link>
      </section>

      <footer className="border-t border-zinc-200 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 text-sm text-zinc-500 md:flex-row md:px-8">
          <p>Career Copilot</p>
          <p>AI assistance for resume improvement and career planning.</p>
        </div>
      </footer>
    </main>
  );
}
