import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";
import { TaskItem } from "@/components/TaskItem";

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

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksApi.getAll();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = await tasksApi.update(id, {
        completed: !task.completed
      });
      
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      
      toast.success(updatedTask.task.completed ? 'Задача выполнена' : 'Задача отмечена как невыполненная');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Ошибка при обновлении задачи');
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Загрузка задач...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Задачи</h1>
            <p className="text-muted-foreground text-sm">
              {tasks.filter(t => !t.completed).length} активных задач
            </p>
          </div>
          <Link to="/tasks/create">
            <Button className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity">
              <Plus className="h-5 w-5 mr-2" />
              Создать
            </Button>
          </Link>
        </div>

        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
