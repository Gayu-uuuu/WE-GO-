"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Layers,
  CheckCircle2,
  Clock,
  LogOut,
  Plus,
  Trash2,
  CheckSquare,
  AlertTriangle,
  User,
  Activity,
  FolderDot,
  Calendar,
  X,
  Loader2,
  Check
} from "lucide-react";

// Local storage keys for Demo Mode fallback
const LOCAL_PROJECTS_KEY = "wego_demo_projects";
const LOCAL_TASKS_KEY = "wego_demo_tasks";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  priority?: "low" | "medium" | "high";
  created_at: string;
}

interface Task {
  id: string;
  project_id: string;
  name: string;
  is_completed: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // App states
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Loading & UI States
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "analytics" | "security">("projects");

  // Modal form states
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectPriority, setNewProjectPriority] = useState<"low" | "medium" | "high">("medium");

  // New task form state
  const [newTaskName, setNewTaskName] = useState("");

  // Determine if using placeholder environment variables
  useEffect(() => {
    const checkAuthAndData = async () => {
      setLoading(true);
      
      const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const dbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const isConfigPlaceholder =
        !dbUrl ||
        dbUrl.includes("your-project-id") ||
        !dbKey ||
        dbKey.includes("your-supabase-anon-key");

      if (isConfigPlaceholder) {
        setIsDemoMode(true);
        // Setup mock user for demo
        setUser({ id: "demo-user-123", email: "demo@example.com" });
        setProfile({ full_name: "Demo Developer", username: "demodev" });
        loadDemoData();
        setLoading(false);
      } else {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (!authUser) {
            // Re-verify on client-side, redirect if no user session
            router.push("/login");
            return;
          }

          setUser(authUser);

          // Get profile
          const { data: profData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();
          
          setProfile(profData || { full_name: authUser.email?.split("@")[0], username: authUser.email?.split("@")[0] });
          
          // Load from Supabase
          await fetchSupabaseData(authUser.id);
        } catch (err) {
          console.error("Error loading Supabase auth/data, falling back to Demo Mode:", err);
          setIsDemoMode(true);
          setUser({ id: "demo-user-123", email: "offline@example.com" });
          setProfile({ full_name: "Offline Developer", username: "offline_dev" });
          loadDemoData();
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthAndData();
  }, [router, supabase]);

  // Load sample demo data
  const loadDemoData = () => {
    let storedProjects = localStorage.getItem(LOCAL_PROJECTS_KEY);
    let storedTasks = localStorage.getItem(LOCAL_TASKS_KEY);

    if (storedProjects && storedTasks) {
      const parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);
      setTasks(JSON.parse(storedTasks));
      if (parsedProjects.length > 0) {
        setSelectedProjectId(parsedProjects[0].id);
      }
    } else {
      // Seed default sample data
      const defaultProjects: Project[] = [
        {
          id: "p1",
          name: "🚀 Launch WE Go! Workspace",
          description: "Initialize Next.js frontend and build the Supabase real-time backend integration.",
          status: "active",
          priority: "high",
          created_at: new Date().toISOString(),
        },
        {
          id: "p2",
          name: "🎨 Tailwind Design System Overhaul",
          description: "Align color systems to solid dark #141414, borders #2A2A2A, and spare lime accents #C6F135.",
          status: "active",
          priority: "medium",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        }
      ];

      const defaultTasks: Task[] = [
        { id: "t1", project_id: "p1", name: "Create landing page + auth layout", is_completed: true, created_at: new Date().toISOString() },
        { id: "t2", project_id: "p1", name: "Configure client/server Supabase hookups", is_completed: true, created_at: new Date().toISOString() },
        { id: "t3", project_id: "p1", name: "Deploy to Vercel production hosting", is_completed: false, created_at: new Date().toISOString() },
        { id: "t4", project_id: "p2", name: "Setup CSS theme mappings in globals.css", is_completed: true, created_at: new Date().toISOString() },
        { id: "t5", project_id: "p2", name: "Verify border stroke weight and spacing ratios", is_completed: false, created_at: new Date().toISOString() },
      ];

      setProjects(defaultProjects);
      setTasks(defaultTasks);
      setSelectedProjectId(defaultProjects[0].id);

      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(defaultProjects));
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(defaultTasks));
    }
  };

  // Fetch real Supabase data
  const fetchSupabaseData = async (userId: string) => {
    // Fetch projects
    const { data: projectsData, error: pError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (pError) throw pError;

    setProjects(projectsData || []);

    if (projectsData && projectsData.length > 0) {
      setSelectedProjectId(projectsData[0].id);
      
      // Fetch tasks
      const projectIds = projectsData.map(p => p.id);
      const { data: tasksData, error: tError } = await supabase
        .from("tasks")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: true });

      if (tError) throw tError;
      setTasks(tasksData || []);
    }
  };

  // Sign out Handler
  const handleSignOut = async () => {
    if (isDemoMode) {
      router.push("/");
    } else {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }
  };

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !user) return;

    const newProjId = isDemoMode ? "p-" + Math.random().toString(36).substr(2, 9) : "";

    const projectPayload = {
      name: newProjectName,
      description: newProjectDesc,
      priority: newProjectPriority,
      status: "active" as const,
      created_at: new Date().toISOString(),
    };

    if (isDemoMode) {
      const updatedProjects = [
        { id: newProjId, ...projectPayload },
        ...projects,
      ];
      setProjects(updatedProjects);
      setSelectedProjectId(newProjId);
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(updatedProjects));
    } else {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .insert([{ user_id: user.id, ...projectPayload }])
        .select()
        .single();

      if (error) {
        alert("Error creating project: " + error.message);
      } else if (data) {
        setProjects([data, ...projects]);
        setSelectedProjectId(data.id);
      }
      setLoading(false);
    }

    // Reset Form
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectPriority("medium");
    setShowNewProjectModal(false);
  };

  // Add Task to Project
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !selectedProjectId) return;

    const taskPayload = {
      name: newTaskName,
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    if (isDemoMode) {
      const newTask = {
        id: "t-" + Math.random().toString(36).substr(2, 9),
        project_id: selectedProjectId,
        ...taskPayload,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updatedTasks));
    } else {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ project_id: selectedProjectId, ...taskPayload }])
        .select()
        .single();

      if (error) {
        alert("Error adding task: " + error.message);
      } else if (data) {
        setTasks([...tasks, data]);
      }
    }
    setNewTaskName("");
  };

  // Toggle Task Completion
  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    if (isDemoMode) {
      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, is_completed: !isCompleted } : t
      );
      setTasks(updatedTasks);
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updatedTasks));
    } else {
      // Optimistic update
      setTasks(tasks.map((t) => t.id === taskId ? { ...t, is_completed: !isCompleted } : t));
      
      const { error } = await supabase
        .from("tasks")
        .update({ is_completed: !isCompleted })
        .eq("id", taskId);

      if (error) {
        // Rollback on error
        setTasks(tasks.map((t) => t.id === taskId ? { ...t, is_completed: isCompleted } : t));
        alert("Failed to update task: " + error.message);
      }
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project and all its tasks?")) return;

    if (isDemoMode) {
      const updatedProjects = projects.filter((p) => p.id !== projectId);
      const updatedTasks = tasks.filter((t) => t.project_id !== projectId);
      
      setProjects(updatedProjects);
      setTasks(updatedTasks);
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(updatedProjects));
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updatedTasks));

      if (selectedProjectId === projectId) {
        setSelectedProjectId(updatedProjects.length > 0 ? updatedProjects[0].id : null);
      }
    } else {
      setLoading(true);
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        alert("Error deleting project: " + error.message);
      } else {
        const updatedProjects = projects.filter((p) => p.id !== projectId);
        setProjects(updatedProjects);
        setTasks(tasks.filter((t) => t.project_id !== projectId));
        if (selectedProjectId === projectId) {
          setSelectedProjectId(updatedProjects.length > 0 ? updatedProjects[0].id : null);
        }
      }
      setLoading(false);
    }
  };

  // Get active project details
  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeProjectTasks = tasks.filter((t) => t.project_id === selectedProjectId);
  const activeProjectDoneCount = activeProjectTasks.filter((t) => t.is_completed).length;
  const activeProjectProgress = activeProjectTasks.length > 0
    ? Math.round((activeProjectDoneCount / activeProjectTasks.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin stroke-[2.5]" />
        <span className="text-xs font-mono text-neutral-500 mt-4">FETCHING WORKSPACE SESSIONS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex relative selection:bg-accent selection:text-black">
      {/* Sidebar Icon Rail */}
      <aside className="w-64 border-r border-border-custom bg-neutral-950 flex flex-col py-6">
        {/* Workspace Brand */}
        <div className="px-6 pb-6 border-b border-border-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-accent text-black flex items-center justify-center font-bold text-sm tracking-tighter">
              W
            </div>
            <span className="font-sans text-base font-bold tracking-tight text-white">
              WE Go<span className="text-accent">!</span> Workspace
            </span>
          </div>
        </div>

        {/* Navigation Rail */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-3 py-2 text-xs font-mono font-semibold rounded transition-colors text-left ${
              activeTab === "projects"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-neutral-500 border border-transparent hover:text-neutral-300"
            }`}
          >
            <FolderDot className="h-4.5 w-4.5" />
            PROJECTS WORKSPACE
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-3 px-3 py-2 text-xs font-mono font-semibold rounded transition-colors text-left ${
              activeTab === "analytics"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-neutral-500 border border-transparent hover:text-neutral-300"
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            ANALYTICS (MOCK)
          </button>
        </nav>

        {/* User Card & Logout */}
        <div className="px-4 pt-6 border-t border-border-custom flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full border border-border-custom bg-neutral-900 flex items-center justify-center text-neutral-400">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{profile?.full_name || "Developer"}</p>
              <p className="text-[10px] font-mono text-neutral-500 truncate">@{profile?.username || "dev"}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2 border border-border-custom hover:border-red-500/20 hover:bg-red-500/5 text-xs font-mono text-neutral-500 hover:text-red-400 rounded transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            SIGN OUT SESSION
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col">
        {/* Banner Notice for Demo Mode */}
        {isDemoMode && (
          <div className="bg-yellow-500/5 border-b border-yellow-500/10 px-6 py-2.5 flex items-center justify-between text-xs text-yellow-400 font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Offline Demo Mode: Configure Supabase credentials in your .env.local to sync data.</span>
            </div>
          </div>
        )}

        {activeTab === "projects" ? (
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Left Column: Projects Overview */}
            <div className="w-full md:w-[55%] border-r border-border-custom p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white">Project Workspaces</h1>
                  <p className="text-xs text-neutral-500 font-mono mt-1">SELECT AN ACTIVE INSTANCE TO TRACK</p>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-3 py-1.5 text-xs font-bold font-mono rounded bg-accent text-black hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" />
                  NEW PROJECT
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="border border-dashed border-border-custom rounded-lg p-10 text-center flex flex-col items-center justify-center">
                  <FolderDot className="h-10 w-10 text-neutral-600 mb-4" />
                  <h3 className="text-sm font-semibold text-white">No projects found</h3>
                  <p className="text-xs text-neutral-500 max-w-[200px] mt-1.5">
                    Click "New Project" to spin up a tracking workspace.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {projects.map((project) => {
                    const projectTasks = tasks.filter((t) => t.project_id === project.id);
                    const doneCount = projectTasks.filter((t) => t.is_completed).length;
                    const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        className={`p-5 rounded-lg border text-left cursor-pointer transition-all ${
                          selectedProjectId === project.id
                            ? "bg-neutral-900/35 border-accent"
                            : "bg-neutral-950/20 border-border-custom hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">{project.name}</h3>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                              {project.description || "No description provided."}
                            </p>
                          </div>
                          {project.priority && (
                            <span
                              className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                project.priority === "high"
                                  ? "text-red-400 border-red-500/30 bg-red-500/5"
                                  : project.priority === "medium"
                                  ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/5"
                                  : "text-neutral-400 border-border-custom bg-neutral-900"
                              }`}
                            >
                              {project.priority}
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex flex-col gap-1.5 mt-4">
                          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                            <span>Milestones Done</span>
                            <span className={selectedProjectId === project.id ? "text-accent font-bold" : ""}>
                              {progress}%
                            </span>
                          </div>
                          <div className="h-1 bg-neutral-900 rounded-full overflow-hidden w-full">
                            <div
                              className={`h-full transition-all duration-300 ${
                                selectedProjectId === project.id ? "bg-accent" : "bg-neutral-600"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-3.5">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-neutral-600" />
                            {doneCount}/{projectTasks.length} Checked
                          </span>
                          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Project Details & Tasks */}
            <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
              {activeProject ? (
                <>
                  {/* Selected Project Header */}
                  <div className="flex items-start justify-between border-b border-border-custom pb-6">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                        {activeProject.name}
                      </h2>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                        {activeProject.description || "No project description provided."}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(activeProject.id)}
                      className="h-8 w-8 shrink-0 border border-border-custom hover:border-red-500/30 hover:bg-red-500/5 text-neutral-500 hover:text-red-400 rounded flex items-center justify-center transition-all cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stat Bar */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border-custom bg-neutral-950/40 p-4 rounded-lg">
                      <span className="text-[10px] font-mono text-neutral-500">WORKSPACE PROGRESS</span>
                      <p className="text-2xl font-bold tracking-tight text-white mt-1">
                        {activeProjectProgress}%
                      </p>
                    </div>
                    <div className="border border-border-custom bg-neutral-950/40 p-4 rounded-lg">
                      <span className="text-[10px] font-mono text-neutral-500">TASKS STATE</span>
                      <p className="text-2xl font-bold tracking-tight text-white mt-1">
                        {activeProjectDoneCount} / <span className="text-neutral-500">{activeProjectTasks.length}</span>
                      </p>
                    </div>
                  </div>

                  {/* Task checklist */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Milestones Checklist</h3>

                    {/* Add task form */}
                    <form onSubmit={handleAddTask} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Add new project milestone..."
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-neutral-900 border border-border-custom rounded text-xs text-white focus:outline-none focus:border-neutral-500 transition-colors"
                      />
                      <button
                        type="submit"
                        className="px-3 rounded border border-border-custom hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </form>

                    {/* Task checklist items */}
                    {activeProjectTasks.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 text-xs font-mono border border-dashed border-border-custom rounded-lg">
                        No milestones added. Type above to add!
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {activeProjectTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id, task.is_completed)}
                            className={`flex items-center gap-3 p-3 rounded border cursor-pointer select-none transition-all ${
                              task.is_completed
                                ? "bg-neutral-900/40 border-accent/10 text-neutral-500"
                                : "bg-neutral-950 border-border-custom hover:border-neutral-800 text-white"
                            }`}
                          >
                            <div
                              className={`h-4.5 w-4.5 rounded flex items-center justify-center border transition-all ${
                                task.is_completed
                                  ? "bg-accent border-accent text-black"
                                  : "border-neutral-600"
                              }`}
                            >
                              {task.is_completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                            </div>
                            <span className={`text-xs font-semibold ${task.is_completed ? "line-through text-neutral-600" : ""}`}>
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <FolderDot className="h-12 w-12 text-neutral-600 mb-4" />
                  <h3 className="text-sm font-semibold text-white">No active project workspace selected</h3>
                  <p className="text-xs text-neutral-500 max-w-[220px] mt-1.5">
                    Choose an active project on the left pane or spawn a new workspace.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "analytics" ? (
          <div className="p-8 flex flex-col gap-6 max-w-3xl">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">System Analytics</h1>
              <p className="text-xs text-neutral-500 font-mono mt-1">PRODUCT-LEVEL VELOCITY REPORT</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-border-custom bg-neutral-950/40 p-6 rounded-lg">
                <span className="text-[10px] font-mono text-neutral-500">TOTAL WORKSPACES</span>
                <p className="text-4xl font-extrabold tracking-tight text-white mt-2">
                  {projects.length}
                </p>
              </div>
              <div className="border border-border-custom bg-neutral-950/40 p-6 rounded-lg">
                <span className="text-[10px] font-mono text-neutral-500">COMPLETED MILESTONES</span>
                <p className="text-4xl font-extrabold tracking-tight text-accent mt-2">
                  {tasks.filter(t => t.is_completed).length}
                </p>
              </div>
              <div className="border border-border-custom bg-neutral-950/40 p-6 rounded-lg">
                <span className="text-[10px] font-mono text-neutral-500">VELOCITY RATIO</span>
                <p className="text-4xl font-extrabold tracking-tight text-white mt-2">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.is_completed).length / tasks.length) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="border border-border-custom rounded-lg p-6 bg-neutral-900/10">
              <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4">Milestone Burn Down Velocity</h3>
              <div className="h-40 flex items-end justify-between gap-2 border-b border-border-custom pb-2 pt-6">
                {[45, 60, 52, 78, 85, 92, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={`w-full rounded-t transition-all duration-500 ${i === 6 ? "bg-accent" : "bg-neutral-800"}`} 
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] font-mono text-neutral-600">Day {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-border-custom rounded-lg bg-neutral-950 max-w-md w-full p-6 relative flex flex-col gap-5">
            <button
              onClick={() => setShowNewProjectModal(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Spawn Project Workspace</h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">SETUP NEW DEVELOPMENT PIPELINE</p>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-neutral-400" htmlFor="pName">
                  PROJECT NAME
                </label>
                <input
                  id="pName"
                  type="text"
                  required
                  placeholder="e.g. Launch Marketing Site"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-border-custom rounded text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-neutral-400" htmlFor="pDesc">
                  PROJECT DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  id="pDesc"
                  rows={3}
                  placeholder="e.g. Setting up Vercel pipelines, domain configurations, and copy updates."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-border-custom rounded text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-neutral-400">PRIORITY TARGET</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewProjectPriority(p)}
                      className={`py-1.5 rounded text-xs font-mono font-semibold uppercase border transition-all ${
                        newProjectPriority === p
                          ? "bg-accent/15 border-accent text-accent"
                          : "bg-neutral-900 border-border-custom text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 border border-border-custom text-xs font-semibold rounded hover:bg-neutral-900 text-neutral-400 transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold font-mono rounded bg-accent text-black hover:opacity-90 transition-opacity cursor-pointer"
                >
                  SPAWN INSTANCE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
