import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Settings, 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  RotateCcw
} from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    description: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadSettings();
  }, [navigate]);

  const loadSettings = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
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
        throw new Error('Ошибка при загрузке настроек');
      }

      const data = await response.json();
      setSettings(data.settings || []);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Ошибка при загрузке настроек');
      // Set default settings if none exist
      setSettings([
        {
          id: 'default1',
          key: 'site_name',
          value: 'Minimalist Redis Hub',
          description: 'Название сайта',
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default2',
          key: 'max_users',
          value: '1000',
          description: 'Максимальное количество пользователей',
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default3',
          key: 'enable_registration',
          value: 'true',
          description: 'Разрешить регистрацию новых пользователей',
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: string, description?: string) => {
    setSaving(true);
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ key, value, description })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении настройки');
      }

      toast.success('Настройка обновлена');
      loadSettings(); // Reload settings
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Ошибка при обновлении настройки');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSetting = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast.error('Заполните ключ и значение');
      return;
    }

    await handleUpdateSetting(newSetting.key, newSetting.value, newSetting.description);
    setNewSetting({ key: "", value: "", description: "" });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка настроек...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
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
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Настройки сайта</h1>
              <p className="text-muted-foreground">Конфигурация системы</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить настройку
          </Button>
        </div>

        {/* Add New Setting Form */}
        {showAddForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Добавить новую настройку</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ключ:</label>
                <Input
                  value={newSetting.key}
                  onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  placeholder="например: max_file_size"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Значение:</label>
                <Input
                  value={newSetting.value}
                  onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                  placeholder="например: 10MB"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Описание (опционально):</label>
              <Textarea
                value={newSetting.description}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Описание настройки..."
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleAddSetting} disabled={saving}>
                {saving ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Отмена
              </Button>
            </div>
          </div>
        )}

        {/* Settings List */}
        <div className="space-y-4">
          {settings.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Настройки отсутствуют</p>
            </div>
          ) : (
            settings.map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onUpdate={handleUpdateSetting}
                saving={saving}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Setting Item Component
interface SettingItemProps {
  setting: SiteSetting;
  onUpdate: (key: string, value: string, description?: string) => void;
  saving: boolean;
}

const SettingItem = ({ setting, onUpdate, saving }: SettingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(setting.value);
  const [description, setDescription] = useState(setting.description || "");

  const handleSave = () => {
    onUpdate(setting.key, value, description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(setting.value);
    setDescription(setting.description || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{setting.key}</h3>
          {setting.description && (
            <p className="text-sm text-muted-foreground">{setting.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Обновлено: {new Date(setting.updatedAt).toLocaleString('ru-RU')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Изменить
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Значение:</label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите значение..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Описание:</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание..."
              rows={2}
            />
          </div>
        </div>
      ) : (
        <div className="bg-muted p-3 rounded-md">
          <p className="font-mono text-sm">{setting.value}</p>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;