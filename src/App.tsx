import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import AdminSettings from "./pages/AdminSettings";
import AdminDatabase from "./pages/AdminDatabase";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import Notes from "./pages/Notes";
import CreateNote from "./pages/CreateNote";
import Goals from "./pages/Goals";
import CreateGoal from "./pages/CreateGoal";
import Finance from "./pages/Finance";
import CreateFinance from "./pages/CreateFinance";
import Feed from "./pages/Feed";
import Articles from "./pages/Articles";
import CreateArticle from "./pages/CreateArticle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/database" element={<AdminDatabase />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/create" element={<CreateNote />} />
              
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/create" element={<CreateGoal />} />
              
              <Route path="/finance" element={<Finance />} />
              <Route path="/finance/create" element={<CreateFinance />} />
              
              <Route path="/feed" element={<Feed />} />
              
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/create" element={<CreateArticle />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
