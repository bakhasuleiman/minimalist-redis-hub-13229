import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Заполните все поля");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username.includes('@') ? username : `${username}@system.local`,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const data = await response.json();
      
      // Check if user is admin
      if (data.user.email !== 'admin@system.local') {
        throw new Error('Доступ запрещен');
      }

      // Store admin token
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      toast.success("Добро пожаловать в админ панель");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error(error.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-muted-foreground text-sm">
            Введите учетные данные администратора
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-sm">Логин</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder="admin"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border-0 text-primary hover:opacity-70 transition-opacity font-semibold text-base disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти в админ панель →"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Вернуться к обычному входу
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;