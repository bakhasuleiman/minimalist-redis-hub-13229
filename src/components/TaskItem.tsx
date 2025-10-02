import { useState } from "react";
import { CheckCircle2, Circle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
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

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskItem = ({ task, onTaskUpdate, onTaskDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [loading, setLoading] = useState(false);

  const toggleCompleted = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.update(task.id, {
        completed: !task.completed
      });
      onTaskUpdate(response.task);
      toast.success(response.task.completed ? "Задача выполнена" : "Задача отмечена как невыполненная");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Ошибка при обновлении задачи");
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Название задачи не может быть пустым");
      return;
    }

    try {
      setLoading(true);
      const response = await tasksApi.update(task.id, {
        title: editTitle,
        description: editDescription
      });
      onTaskUpdate(response.task);
      setIsEditing(false);
      toast.success("Задача обновлена");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Ошибка при обновлении задачи");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту задачу?")) {
      return;
    }

    try {
      setLoading(true);
      await tasksApi.delete(task.id);
      onTaskDelete(task.id);
      toast.success("Задача удалена");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Ошибка при удалении задачи");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 border border-border rounded-md bg-muted/10">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Название задачи"
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Описание задачи"
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 resize-none focus-visible:ring-0 focus-visible:border-primary"
            rows={3}
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
    <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors group">
      <button 
        onClick={toggleCompleted}
        disabled={loading}
        className="flex-shrink-0"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-muted-foreground"} mt-1`}>
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString('ru-RU')}
          </span>
          {task.user.username && (
            <span className="text-xs text-muted-foreground">
              • @{task.user.username}
            </span>
          )}
          {task.privacy !== "PRIVATE" && (
            <span className="text-xs text-muted-foreground">
              • {task.privacy === "PUBLIC" ? "Публичная" : "Общая"}
            </span>
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
          onClick={deleteTask}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};