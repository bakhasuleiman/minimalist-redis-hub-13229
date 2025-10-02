import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { goalsApi } from "@/lib/api";
import { toast } from "sonner";
import { GoalItem } from "@/components/GoalItem";

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

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await goalsApi.getAll();
      setGoals(response.goals);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Ошибка при загрузке целей');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Загрузка целей...</p>
        </div>
      </div>
    );
  }

  const handleGoalUpdate = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const handleGoalDelete = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

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

        <div className="space-y-1">
          {goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onGoalUpdate={handleGoalUpdate}
              onGoalDelete={handleGoalDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Goals;
