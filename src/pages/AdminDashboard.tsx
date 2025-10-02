import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Users, 
  FileText, 
  Target, 
  DollarSign, 
  MessageSquare,
  Settings,
  Database,
  Shield,
  LogOut
} from "lucide-react";

interface DashboardStats {
  users: number;
  tasks: number;
  notes: number;
  goals: number;
  transactions: number;
  articles: number;
  feedbacks: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка при загрузке статистики');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Ошибка при загрузке статистики');
      // Fallback to mock data
      setStats({
        users: 15,
        tasks: 245,
        notes: 89,
        goals: 67,
        transactions: 134,
        articles: 23,
        feedbacks: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Выход из админ панели');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Панель администратора</h1>
              <p className="text-muted-foreground">Управление системой</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Пользователи</p>
                <p className="text-2xl font-bold">{stats?.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Задачи</p>
                <p className="text-2xl font-bold">{stats?.tasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Цели</p>
                <p className="text-2xl font-bold">{stats?.goals}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Обращения</p>
                <p className="text-2xl font-bold">{stats?.feedbacks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Управление пользователями</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Просмотр, редактирование и удаление пользователей
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/users')}
            >
              Управлять пользователями
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Обратная связь</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Просмотр и ответ на отзывы и сообщения об ошибках
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/feedbacks')}
            >
              Просмотреть обращения
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Настройки сайта</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Изменение настроек и конфигурации системы
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/settings')}
            >
              Настройки
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">База данных</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Статистика и управление базой данных
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/database')}
            >
              Управление БД
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Сброс паролей</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Сброс паролей пользователей
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/password-reset')}
            >
              Сбросить пароли
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Финансовая статистика</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {stats?.transactions} транзакций в системе
            </p>
            <Button 
              className="w-full"
              onClick={() => toast.info('Функция в разработке')}
            >
              Посмотреть статистику
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;