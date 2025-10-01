import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useHotkeys = (onShowHelp: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Show help modal
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onShowHelp();
        return;
      }

      // Navigation with numbers (1-6)
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            navigate("/tasks");
            break;
          case "2":
            e.preventDefault();
            navigate("/notes");
            break;
          case "3":
            e.preventDefault();
            navigate("/goals");
            break;
          case "4":
            e.preventDefault();
            navigate("/finance");
            break;
          case "5":
            e.preventDefault();
            navigate("/feed");
            break;
          case "6":
            e.preventDefault();
            navigate("/articles");
            break;
        }
      }

      // Create new item with 'c' or 'n'
      if ((e.key === "c" || e.key === "n") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const currentPath = location.pathname;
        
        if (currentPath.includes("/tasks")) navigate("/tasks/create");
        else if (currentPath.includes("/notes")) navigate("/notes/create");
        else if (currentPath.includes("/goals")) navigate("/goals/create");
        else if (currentPath.includes("/finance")) navigate("/finance/create");
        else if (currentPath.includes("/articles")) navigate("/articles/create");
      }

      // Go back with Escape
      if (e.key === "Escape") {
        if (location.pathname.includes("/create")) {
          e.preventDefault();
          navigate(-1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, location, onShowHelp]);
};
