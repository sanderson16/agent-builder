import Link from "next/link";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Describe Your Problem",
    description:
      "Answer a few plain-English questions about what you wish was automatic. No technical knowledge needed.",
  },
  {
    step: "2",
    title: "We Pick the Tech",
    description:
      "The app automatically selects the best runtime, AI framework, and integrations for your use case.",
  },
  {
    step: "3",
    title: "Paste and Build",
    description:
      "Copy the generated prompt, paste it into Claude Code, and follow the guided setup. That's it.",
  },
];

const EXAMPLES = [
  {
    title: "Post-Meeting Follow-Up",
    category: "Customer Communication",
    description:
      "Automatically summarize call transcripts and draft follow-up emails to attendees.",
  },
  {
    title: "Ticket Spike Detector",
    category: "Data Monitoring",
    description:
      "Watch for unusual spikes in support tickets and alert the team with root-cause analysis.",
  },
  {
    title: "Weekly Pipeline Report",
    category: "Reporting",
    description:
      "Generate a weekly snapshot of the renewal pipeline with trends and at-risk accounts.",
  },
  {
    title: "KB Article Drafter",
    category: "Content Creation",
    description:
      "Turn resolved support tickets into polished knowledge base articles automatically.",
  },
  {
    title: "Feature Request Trends",
    category: "Research & Analysis",
    description:
      "Analyze and categorize feature requests across accounts to find patterns.",
  },
  {
    title: "Smart Ticket Router",
    category: "Workflow Automation",
    description:
      "Automatically categorize incoming tickets and route them to the right team member.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Build AI Agents
          <br />
          <span className="text-primary-400">for Your Team</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Describe what you wish was automatic — in plain English, like making a wish list.
          We handle all the technical decisions. You get a ready-to-paste prompt
          that builds your agent for you. No coding required.
        </p>
        <Link
          href="/builder"
          className="inline-block mt-8 px-8 py-3.5 rounded-lg text-base font-semibold
            bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          Start Building
        </Link>
      </section>

      {/* How It Works */}
      <section className="pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example Agents */}
      <section className="pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Example Agents
        </h2>
        <p className="text-gray-400 text-center mb-10">
          Here&apos;s what your team could build in minutes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.title}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
            >
              <p className="text-xs text-primary-400 font-medium uppercase tracking-wider mb-2">
                {ex.category}
              </p>
              <h3 className="text-base font-semibold text-white mb-1.5">
                {ex.title}
              </h3>
              <p className="text-sm text-gray-400">{ex.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 text-center">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to automate?
          </h2>
          <p className="text-gray-400 mb-6">
            It takes less than 2 minutes. No account needed.
          </p>
          <Link
            href="/builder"
            className="inline-block px-8 py-3.5 rounded-lg text-base font-semibold
              bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            Start Building
          </Link>
        </div>
      </section>
    </div>
  );
}
