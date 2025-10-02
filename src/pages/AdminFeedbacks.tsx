import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  MessageSquare, 
  ArrowLeft,
  Bug,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  RotateCcw
} from "lucide-react";

interface Feedback {
  id: string;
  type: 'FEEDBACK' | 'BUG';
  title: string;
  message: string;
  email?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userEmail?: string;
}

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [newStatus, setNewStatus] = useState<string>("OPEN");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadFeedbacks();
  }, [navigate]);

  const loadFeedbacks = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedbacks`, {
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
        throw new Error('Ошибка при загрузке обращений');
      }

      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      toast.error('Ошибка при загрузке обращений');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeedback = async () => {
    if (!selectedFeedback) return;

    setUpdating(true);
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedbacks/${selectedFeedback.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: newStatus,
          adminReply: adminReply.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении обращения');
      }

      toast.success('Обращение успешно обновлено');
      setSelectedFeedback(null);
      setAdminReply("");
      loadFeedbacks(); // Reload feedbacks list
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Ошибка при обновлении обращения');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <RotateCcw className="h-4 w-4" />;
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CLOSED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'RESOLVED':
        return 'bg-green-500';
      case 'CLOSED':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Открыто';
      case 'IN_PROGRESS':
        return 'В работе';
      case 'RESOLVED':
        return 'Решено';
      case 'CLOSED':
        return 'Закрыто';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка обращений...</p>
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
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Обратная связь</h1>
              <p className="text-muted-foreground">Всего обращений: {feedbacks.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feedbacks List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Список обращений</h2>
            
            {feedbacks.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Обращения отсутствуют</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedFeedback?.id === feedback.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setAdminReply(feedback.adminReply || "");
                      setNewStatus(feedback.status);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {feedback.type === 'BUG' ? (
                          <Bug className="h-4 w-4 text-red-500" />
                        ) : (
                          <Heart className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="text-sm font-medium">
                          {feedback.type === 'BUG' ? 'Баг' : 'Отзыв'}
                        </span>
                      </div>
                      <Badge className={`${getStatusColor(feedback.status)} text-white`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(feedback.status)}
                          {getStatusText(feedback.status)}
                        </div>
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium mb-2 line-clamp-1">{feedback.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{feedback.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {feedback.userName ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {feedback.userName}
                          </div>
                        ) : feedback.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {feedback.email}
                          </div>
                        ) : (
                          <span>Анонимно</span>
                        )}
                      </div>
                      <span>{new Date(feedback.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Детали обращения</h2>
            
            {selectedFeedback ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {selectedFeedback.type === 'BUG' ? (
                      <Bug className="h-5 w-5 text-red-500" />
                    ) : (
                      <Heart className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="font-medium">
                      {selectedFeedback.type === 'BUG' ? 'Сообщение об ошибке' : 'Отзыв'}
                    </span>
                  </div>
                  <Badge className={`${getStatusColor(selectedFeedback.status)} text-white`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedFeedback.status)}
                      {getStatusText(selectedFeedback.status)}
                    </div>
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedFeedback.title}</h3>
                  <p className="text-muted-foreground mb-4">{selectedFeedback.message}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">От:</p>
                      <p>{selectedFeedback.userName || selectedFeedback.email || 'Анонимно'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Дата:</p>
                      <p>{new Date(selectedFeedback.createdAt).toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                </div>

                {selectedFeedback.adminReply && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Ответ администратора:</p>
                    <p className="text-sm">{selectedFeedback.adminReply}</p>
                  </div>
                )}

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Статус:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="OPEN">Открыто</option>
                      <option value="IN_PROGRESS">В работе</option>
                      <option value="RESOLVED">Решено</option>
                      <option value="CLOSED">Закрыто</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Ответ администратора:</label>
                    <Textarea
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      placeholder="Введите ответ..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={handleUpdateFeedback}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Обновление...
                      </>
                    ) : (
                      'Обновить обращение'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Выберите обращение для просмотра деталей</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbacks;