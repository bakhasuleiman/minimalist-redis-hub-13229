import { NavLink, Outlet } from "react-router-dom";
import { 
  CheckSquare, 
  FileText, 
  Target, 
  DollarSign, 
  Rss, 
  BookOpen,
  Menu,
  Keyboard
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useHotkeys } from "@/hooks/useHotkeys";
import HotkeyHelp from "./HotkeyHelp";

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
  const [helpOpen, setHelpOpen] = useState(false);
  
  useHotkeys(() => setHelpOpen(true));

  return (
    <div className="min-h-screen flex w-full bg-background">
      <HotkeyHelp open={helpOpen} onOpenChange={setHelpOpen} />
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
          {navItems.map((item, index) => (
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
              {sidebarOpen && (
                <span className="text-sm flex-1">{item.title}</span>
              )}
              {sidebarOpen && (
                <kbd className="text-xs text-muted-foreground opacity-50">
                  {index + 1}
                </kbd>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setHelpOpen(true)}
            className="w-full justify-start hover:bg-sidebar-accent/50"
          >
            <Keyboard className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Горячие клавиши</span>}
            {sidebarOpen && (
              <kbd className="ml-auto text-xs text-muted-foreground opacity-50">
                ?
              </kbd>
            )}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
