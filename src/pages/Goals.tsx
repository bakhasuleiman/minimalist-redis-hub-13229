import { Link } from "react-router-dom";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: Date;
}

const Goals = () => {
  const goals: Goal[] = [
    { id: "1", title: "Запустить MVP продукта", progress: 60, deadline: new Date("2025-11-01") },
    { id: "2", title: "Изучить TypeScript", progress: 80, deadline: new Date("2025-10-15") },
    { id: "3", title: "Читать по 30 минут в день", progress: 40, deadline: new Date("2025-12-31") },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Планы и Цели</h1>
            <p className="text-muted-foreground text-sm">{goals.length} активных целей</p>
          </div>
          <Link to="/goals/create">
            <Button className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity">
              <Plus className="h-5 w-5 mr-2" />
              Создать
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-6 hover:bg-muted/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-3 mb-3">
                <Target className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    До {goal.deadline.toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="ml-8">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Goals;
