import { Link } from "react-router-dom";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Создать дизайн-систему", completed: true, createdAt: new Date() },
    { id: "2", title: "Реализовать аутентификацию", completed: false, createdAt: new Date() },
    { id: "3", title: "Добавить базу данных", completed: false, createdAt: new Date() },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

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

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-3 p-4 hover:bg-muted/30 cursor-pointer transition-colors group"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              )}
              <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
