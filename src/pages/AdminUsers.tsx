import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Users, 
  Trash2, 
  Search,
  ArrowLeft,
  UserX,
  Shield,
  RotateCcw
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    tasks: number;
    notes: number;
    goals: number;
    transactions: number;
    articles: number;
  };
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
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
        throw new Error('Ошибка при загрузке пользователей');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя "${userName}"? Это действие нельзя отменить.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
      }

      toast.success('Пользователь успешно удален');
      loadUsers(); // Reload users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Ошибка при удалении пользователя');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleResetPassword = async (userId: string, userName: string) => {
    const newPassword = prompt(`Введите новый пароль для пользователя "${userName}":`);
    if (!newPassword || newPassword.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    setResettingPasswordUserId(userId);
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ newPassword })
      });

      if (!response.ok) {
        throw new Error('Ошибка при сбросе пароля');
      }

      toast.success('Пароль успешно сброшен');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Ошибка при сбросе пароля');
    } finally {
      setResettingPasswordUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Управление пользователями</h1>
              <p className="text-muted-foreground">Всего пользователей: {users.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Пользователь</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Статистика</th>
                  <th className="text-left p-4">Дата регистрации</th>
                  <th className="text-left p-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <p>Задачи: {user._count.tasks}</p>
                        <p>Заметки: {user._count.notes}</p>
                        <p>Цели: {user._count.goals}</p>
                        <p>Транзакции: {user._count.transactions}</p>
                        <p>Статьи: {user._count.articles}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(user.id, user.name)}
                          disabled={resettingPasswordUserId === user.id}
                          className="flex items-center gap-2"
                        >
                          {resettingPasswordUserId === user.id ? (
                            <>
                              <RotateCcw className="h-4 w-4 animate-spin" />
                              Сброс...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4" />
                              Сбросить пароль
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={deletingUserId === user.id}
                          className="flex items-center gap-2"
                        >
                          {deletingUserId === user.id ? (
                            <>
                              <RotateCcw className="h-4 w-4 animate-spin" />
                              Удаление...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Удалить
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Пользователи не найдены' : 'Пользователи отсутствуют'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;