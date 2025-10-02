import { useState } from "react";
import { Target, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { goalsApi } from "@/lib/api";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  deadline?: string;
  privacy: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
  };
}

interface GoalItemProps {
  goal: Goal;
  onGoalUpdate: (updatedGoal: Goal) => void;
  onGoalDelete: (goalId: string) => void;
}

export const GoalItem = ({ goal, onGoalUpdate, onGoalDelete }: GoalItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDescription, setEditDescription] = useState(goal.description || "");
  const [editProgress, setEditProgress] = useState([goal.progress]);
  const [editDeadline, setEditDeadline] = useState(goal.deadline ? goal.deadline.split('T')[0] : "");
  const [loading, setLoading] = useState(false);

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Название цели не может быть пустым");
      return;
    }

    try {
      setLoading(true);
      const response = await goalsApi.update(goal.id, {
        title: editTitle,
        description: editDescription,
        progress: editProgress[0],
        deadline: editDeadline || undefined
      });
      onGoalUpdate(response.goal);
      setIsEditing(false);
      toast.success("Цель обновлена");
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Ошибка при обновлении цели");
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту цель?")) {
      return;
    }

    try {
      setLoading(true);
      await goalsApi.delete(goal.id);
      onGoalDelete(goal.id);
      toast.success("Цель удалена");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Ошибка при удалении цели");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditTitle(goal.title);
    setEditDescription(goal.description || "");
    setEditProgress([goal.progress]);
    setEditDeadline(goal.deadline ? goal.deadline.split('T')[0] : "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 border border-border rounded-md bg-muted/10">
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Название цели"
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Описание цели"
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 resize-none focus-visible:ring-0 focus-visible:border-primary"
            rows={3}
          />
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Прогресс: {editProgress[0]}%
            </label>
            <Slider
              value={editProgress}
              onValueChange={setEditProgress}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <Input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
          />
          <div className="flex gap-2">
            <Button 
              onClick={saveEdit}
              disabled={loading}
              className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity text-sm"
            >
              Сохранить
            </Button>
            <Button 
              onClick={cancelEdit}
              disabled={loading}
              variant="ghost"
              className="hover:bg-transparent text-muted-foreground hover:text-foreground text-sm"
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 hover:bg-muted/30 transition-colors group">
      <div className="flex items-start gap-3">
        <Target className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{goal.title}</h3>
              {goal.description && (
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span>{new Date(goal.createdAt).toLocaleDateString('ru-RU')}</span>
                {goal.deadline && (
                  <span>• До {new Date(goal.deadline).toLocaleDateString('ru-RU')}</span>
                )}
                {goal.user.username && (
                  <span>• @{goal.user.username}</span>
                )}
                {goal.privacy !== "PRIVATE" && (
                  <span>• {goal.privacy === "PUBLIC" ? "Публичная" : "Общая"}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={deleteGoal}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{goal.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};