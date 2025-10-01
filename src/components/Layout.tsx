import { NavLink, Outlet } from "react-router-dom";
import { 
  CheckSquare, 
  FileText, 
  Target, 
  DollarSign, 
  Rss, 
  BookOpen,
  Menu
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Задачи", url: "/tasks", icon: CheckSquare },
  { title: "Заметки", url: "/notes", icon: FileText },
  { title: "Планы и Цели", url: "/goals", icon: Target },
  { title: "Финансы", url: "/finance", icon: DollarSign },
  { title: "Лента", url: "/feed", icon: Rss },
  { title: "Статьи", url: "/articles", icon: BookOpen },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-16"
        } bg-sidebar border-r border-border transition-all duration-200 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="text-lg font-bold">Hub</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-sidebar-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 mb-1 rounded transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
