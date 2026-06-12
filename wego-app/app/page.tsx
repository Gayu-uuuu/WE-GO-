"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckSquare, 
  Layers, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  KanbanSquare, 
  ShieldCheck, 
  ChevronRight,
  Plus
} from "lucide-react";

export default function LandingPage() {
  // Mock interactive state for the product preview
  const [tasks, setTasks] = useState([
    { id: 1, name: "Configure Supabase DB Schema", completed: true },
    { id: 2, name: "Design Dark Mode Interface", completed: true },
    { id: 3, name: "Integrate email authentication", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black flex flex-col">
      {/* Header */}
      <header className="border-b border-border-custom px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-accent text-black flex items-center justify-center font-bold text-lg tracking-tighter">
            W
          </div>
          <span className="font-sans text-xl font-bold tracking-tight">
            WE Go<span className="text-accent">!</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#preview" className="hover:text-white transition-colors">Interface</a>
          <a href="#pricing" className="hover:text-white transition-colors">Security</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login?signup=true"
            className="px-4 py-2 text-sm font-semibold rounded bg-accent text-black hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-4xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-custom bg-neutral-900/50 text-xs font-medium text-neutral-300 mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Now integrated with Supabase Auth</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 max-w-3xl">
            The project tracker built for <span className="text-accent font-extrabold">execution</span>.
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 font-normal leading-relaxed">
            Eliminate clutter and focus on progress. Organize projects, schedule milestones, and check off tasks in an interface designed for absolute speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <Link
              href="/login"
              className="px-6 py-3.5 text-base font-semibold rounded bg-accent text-black flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              Enter Workspace
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
            <a
              href="#preview"
              className="px-6 py-3.5 text-base font-semibold rounded border border-border-custom bg-transparent hover:bg-neutral-900/40 transition-colors flex items-center justify-center gap-2"
            >
              Try Interactive Preview
            </a>
          </div>
        </section>

        {/* Product Interface Mockup (Interactive Preview) */}
        <section id="preview" className="w-full max-w-5xl px-6 pb-24">
          <div className="border border-border-custom rounded-xl overflow-hidden bg-neutral-950/80 backdrop-blur-xl">
            {/* Window Header */}
            <div className="border-b border-border-custom bg-neutral-900/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-neutral-800" />
                <div className="h-3 w-3 rounded-full bg-neutral-800" />
                <div className="h-3 w-3 rounded-full bg-neutral-800" />
                <span className="text-xs text-neutral-500 ml-4 font-mono">workspace/we-go-app</span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1 rounded border border-border-custom">
                <div className="h-2 w-2 rounded-full bg-accent animate-ping" />
                <span className="text-[10px] font-mono font-medium text-accent">LIVE WORKSPACE MOCK</span>
              </div>
            </div>

            {/* Workspace Layout */}
            <div className="flex min-h-[450px]">
              {/* Sidebar Rail */}
              <div className="w-16 border-r border-border-custom flex flex-col items-center py-6 gap-6 bg-neutral-950">
                <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="h-9 w-9 rounded-lg hover:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
                  <KanbanSquare className="h-5 w-5" />
                </div>
                <div className="h-9 w-9 rounded-lg hover:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="mt-auto h-9 w-9 rounded-lg hover:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="flex-1 p-6 md:p-8 bg-background flex flex-col md:flex-row gap-6">
                {/* Project List */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-neutral-400 tracking-wider uppercase">Active Projects</h3>
                    <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded">
                      1 Active
                    </span>
                  </div>

                  {/* Active Project Card */}
                  <div className="border border-border-custom bg-neutral-900/30 p-5 rounded-lg flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">🚀 Launch WE Go! Platform</h4>
                        <p className="text-xs text-neutral-500 mt-1">Primary production release trackers</p>
                      </div>
                      <span className="text-xs font-medium text-accent border border-accent/30 px-2 py-0.5 rounded bg-accent/5">
                        High Priority
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>Milestones Progress</span>
                        <span className="text-accent font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-400 mt-2 font-mono">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        {completedCount}/{tasks.length} Done
                      </span>
                      <span>•</span>
                      <span>Target: June 15</span>
                    </div>
                  </div>

                  {/* Disabled Mock Card */}
                  <div className="border border-border-custom/50 bg-neutral-900/10 p-5 rounded-lg opacity-40 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">✨ Marketing Landing Campaign</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Scheduled for Phase 2</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-600" />
                  </div>
                </div>

                {/* Subtasks Panel (Interactive Checklist) */}
                <div className="w-full md:w-1/2 border border-border-custom bg-neutral-900/20 p-5 rounded-lg flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-border-custom pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">Project Checklist</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Click to toggle tasks and watch metrics update</p>
                    </div>
                    <button className="h-7 w-7 rounded border border-border-custom hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Task List */}
                  <div className="flex flex-col gap-2.5 flex-1 justify-center">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-center gap-3 p-3 rounded border cursor-pointer select-none transition-all ${
                          task.completed
                            ? "bg-neutral-900/60 border-accent/20 text-neutral-400"
                            : "bg-neutral-950 border-border-custom hover:border-neutral-700 text-white"
                        }`}
                      >
                        <div
                          className={`h-4.5 w-4.5 rounded flex items-center justify-center border transition-all ${
                            task.completed
                              ? "bg-accent border-accent text-black"
                              : "border-neutral-600"
                          }`}
                        >
                          {task.completed && (
                            <svg className="h-3 w-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs font-medium ${task.completed ? "line-through text-neutral-500" : ""}`}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {progressPercent === 100 && (
                    <div className="p-3 bg-accent/10 border border-accent/30 rounded text-center text-accent text-xs font-bold font-mono animate-bounce mt-2">
                      🎉 ALL MILESTONES COMPLETED! Ready to ship.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="w-full border-t border-border-custom bg-neutral-950 py-20 px-6 flex flex-col items-center">
          <div className="max-w-5xl w-full">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-12 text-center">
              Designed for developers who ship code.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="border border-border-custom bg-background p-6 rounded-lg hover:border-neutral-700 transition-colors">
                <div className="h-10 w-10 rounded bg-neutral-900 border border-border-custom flex items-center justify-center text-accent mb-4">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Granular Subtasks</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Break major milestones down into specific, actionable line items. Watch progress calculations compute instantly as you work.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-border-custom bg-background p-6 rounded-lg hover:border-neutral-700 transition-colors">
                <div className="h-10 w-10 rounded bg-neutral-900 border border-border-custom flex items-center justify-center text-accent mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Relational Database</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Powered by Supabase PostgreSQL. High-speed reading, updating, and filtering with robust Row Level Security safeguarding your data.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-border-custom bg-background p-6 rounded-lg hover:border-neutral-700 transition-colors">
                <div className="h-10 w-10 rounded bg-neutral-900 border border-border-custom flex items-center justify-center text-accent mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Secure Authentication</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Robust email authentication directly through Supabase Auth, keeping your workspaces secure and personal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-custom bg-background px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 font-mono">
            &copy; 2026 WE Go!. Built with Next.js & Supabase.
          </span>
          <div className="flex gap-6 text-xs text-neutral-400 font-mono">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
