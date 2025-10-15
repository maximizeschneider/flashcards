import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const highlights = [
  {
    title: "Smarter spaced repetition",
    description:
      "Adaptive scheduling prioritizes the cards you are most likely to forget, so every review session counts.",
  },
  {
    title: "AI-assisted creation",
    description:
      "Generate draft flashcards from lecture notes, documents, or URLs and refine them with human-friendly controls.",
  },
  {
    title: "All-in-one progress",
    description:
      "Monitor streaks, accuracy, and mastery level from a single dashboard that updates in real time.",
  },
];

const faqs = [
  {
    question: "Is Flashcards free to use?",
    answer:
      "Yes. You can create unlimited decks and cards for personal study. Team plans with collaboration features are coming soon.",
  },
  {
    question: "Can I import existing flashcards?",
    answer:
      "Upload CSV files or paste structured text and we will convert them into spaced-repetition ready cards in seconds.",
  },
  {
    question: "How does the AI assistant work?",
    answer:
      "The assistant summarizes your sources and suggests question-answer pairs. You stay in control by editing, approving, or discarding each suggestion before it is saved.",
  },
];

export const metadata: Metadata = {
  title: "Flashcards – AI-powered spaced repetition for unstoppable learners",
  description:
    "Turn reading lists into review-ready flashcards, track spaced repetition progress, and stay exam-ready with AI-assisted study workflows.",
  keywords: [
    "flashcards",
    "spaced repetition",
    "study app",
    "learning",
    "convex",
    "ai flashcards",
  ],
  openGraph: {
    title: "Flashcards – Remember more with AI and spaced repetition",
    description:
      "Create decks in minutes, review with science-backed intervals, and keep your memory sharp with actionable analytics.",
    url: "https://flashcards.app",
    siteName: "Flashcards",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flashcards – Study faster, remember longer",
    description:
      "AI-assisted flashcard creation, personalized review queues, and granular progress tracking in one delightful workspace.",
  },
  alternates: {
    canonical: "https://flashcards.app",
  },
};

function Stats() {
  const stats = [
    { label: "Learners mastering", value: "12k+" },
    { label: "Decks created each week", value: "38,000" },
    { label: "Average recall boost", value: "42%" },
  ];

  return (
    <dl className="grid gap-6 rounded-3xl border border-border/60 bg-muted/40 p-6 text-center sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="text-sm font-medium text-muted-foreground">{stat.label}</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-primary">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Flashcards',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '287',
    },
  } as const;

  return (
    <>
      <Script id="flashcards-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">Flashcards</span>
              <span className="hidden text-muted-foreground sm:inline">Master anything with intentional review.</span>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link className="text-muted-foreground transition hover:text-primary" href="#features">
                Features
              </Link>
              <Link className="text-muted-foreground transition hover:text-primary" href="#testimonials">
                Results
              </Link>
              <Link className="text-muted-foreground transition hover:text-primary" href="#faq">
                FAQ
              </Link>
              <Link
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                href="/sign-in"
              >
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <section className="px-6">
          <div className="mx-auto grid max-w-6xl gap-10 py-20 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                AI + spaced repetition
              </span>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Turn any syllabus into exam-ready mastery sessions.
              </h1>
              <p className="text-pretty text-lg text-muted-foreground">
                Flashcards combines AI-assisted content generation with a proven spaced repetition engine. Craft high-impact study decks, review them at the perfect moment, and stay confident from day one to finals week.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                >
                  Start learning for free
                </Link>
                <Link
                  href="#features"
                  className="flex items-center justify-center rounded-full border border-border px-6 py-3 text-base font-semibold text-muted-foreground transition hover:border-primary/60 hover:text-primary"
                >
                  Explore the platform
                </Link>
              </div>
              <Stats />
            </div>
            <div className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-background p-6 shadow-xl">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">Personalized queue</p>
                  <h2 className="text-2xl font-bold tracking-tight">Study sessions crafted around your memory curve</h2>
                  <p className="text-sm text-muted-foreground">
                    Review cards in a focused workspace, unlock streak rewards, and watch mastery indicators climb with every successful recall.
                  </p>
                </div>
                <div className="grid gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/40 p-4">
                  <div className="grid gap-2 rounded-xl bg-background p-3 shadow-sm">
                    <p className="text-sm font-semibold">Cellular respiration</p>
                    <p className="text-sm text-muted-foreground">Which molecule carries electrons to the electron transport chain?</p>
                    <span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Review ready</span>
                  </div>
                  <div className="grid gap-2 rounded-xl bg-background p-3 shadow-sm">
                    <p className="text-sm font-semibold">Organic chemistry</p>
                    <p className="text-sm text-muted-foreground">What is the rate-limiting step in an E1 reaction?</p>
                    <span className="w-fit rounded-full bg-emerald-100/80 px-2 py-1 text-xs font-medium text-emerald-700">Mastered</span>
                  </div>
                  <div className="grid gap-2 rounded-xl bg-background p-3 shadow-sm">
                    <p className="text-sm font-semibold">Pathophysiology</p>
                    <p className="text-sm text-muted-foreground">Name two compensatory mechanisms triggered by acute blood loss.</p>
                    <span className="w-fit rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Learning</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Trusted by ambitious students and lifelong learners at top universities, bootcamps, and research labs.
                </p>
              </div>
              <div className="absolute -right-6 -top-6 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-border/40 bg-background px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-16">
            <div className="space-y-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Why it works</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Deep learning tools for serious study goals</h2>
              <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground">
                Blend AI drafting with manual craftsmanship, keep every concept on a spaced repetition timeline, and measure outcomes across every deck.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {highlights.map((feature) => (
                <article key={feature.title} className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-muted/30 p-6 text-left">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <span className="mt-auto text-sm font-semibold text-primary">Learn more →</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-gradient-to-br from-background via-background to-primary/5 px-6 py-20">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Results</span>
              <h2 className="text-3xl font-bold tracking-tight">Learners who stay ahead of every exam</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((index) => (
                <blockquote key={index} className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    “Flashcards helped me compress a semester of biochemistry into daily sprints. The AI suggestions are scarily accurate, and the review pace kept me calm heading into exams.”
                  </p>
                  <footer className="mt-6 text-sm font-semibold text-foreground">
                    Avery Chen · Second-year medical student
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-y border-border/40 bg-background px-6 py-20">
          <div className="mx-auto grid max-w-4xl gap-12">
            <div className="space-y-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">FAQ</span>
              <h2 className="text-3xl font-bold tracking-tight">Everything you need to know</h2>
              <p className="text-pretty text-sm text-muted-foreground">
                Get answers to popular questions about pricing, data ownership, and the AI assistant.
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-border/60 bg-muted/20 p-5">
                  <summary className="cursor-pointer text-base font-semibold text-foreground">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl border border-primary/30 bg-background/80 p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to remember everything that matters?</h2>
            <p className="max-w-2xl text-balance text-base text-muted-foreground">
              Join thousands of learners who plan smarter reviews, catch knowledge gaps early, and stay energized with delightful study rituals.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
              >
                Create your free account
              </Link>
              <Link
                href="/sign-in"
                className="rounded-full border border-border px-8 py-3 text-base font-semibold text-muted-foreground transition hover:border-primary/60 hover:text-primary"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-border/40 bg-background px-6 py-10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Flashcards. Built with Next.js, Convex, and shadcn/ui for unstoppable learners.
        </footer>
      </main>
    </>
  );
}
