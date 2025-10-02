import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CreateGoal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [goalType, setGoalType] = useState<"regular" | "purchase" | "savings">("regular");
  const [targetAmount, setTargetAmount] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public" | "specific">("private");
  const [sharedWith, setSharedWith] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/goals");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Введите название цели");
      return;
    }
    toast.success("Цель создана");
    navigate("/goals");
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/goals")}
          className="mb-6 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold mb-8">Новая цель</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Тип цели
            </h2>
            <div className="space-y-3">
              <div
                onClick={() => setGoalType("regular")}
                className={`p-4 cursor-pointer transition-colors ${
                  goalType === "regular" ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border ${
                    goalType === "regular" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium">Обычная цель</p>
                    <p className="text-sm text-muted-foreground">Цель без привязки к деньгам</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setGoalType("purchase")}
                className={`p-4 cursor-pointer transition-colors ${
                  goalType === "purchase" ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border ${
                    goalType === "purchase" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium">Цель на покупку</p>
                    <p className="text-sm text-muted-foreground">Накопление на конкретную покупку</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setGoalType("savings")}
                className={`p-4 cursor-pointer transition-colors ${
                  goalType === "savings" ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border ${
                    goalType === "savings" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium">Сбор средств</p>
                    <p className="text-sm text-muted-foreground">Накопление определенной суммы</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Основная информация
            </h2>
            <div>
              <Label htmlFor="title" className="text-sm mb-2 block">
                Название *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                placeholder="Чего хотите достичь?"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm mb-2 block">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 min-h-32 resize-none focus-visible:ring-0 focus-visible:border-primary"
                placeholder="Детали цели и план действий..."
              />
            </div>

            {(goalType === "purchase" || goalType === "savings") && (
              <div>
                <Label htmlFor="targetAmount" className="text-sm mb-2 block">
                  Целевая сумма *
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                  placeholder="0"
                />
              </div>
            )}

            <div>
              <Label htmlFor="deadline" className="text-sm mb-2 block">
                Срок выполнения
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Настройки приватности
            </h2>
            <div className="space-y-3">
              <div
                onClick={() => setPrivacy("private")}
                className={`p-4 cursor-pointer transition-colors ${
                  privacy === "private" ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border ${
                    privacy === "private" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium">Приватная</p>
                    <p className="text-sm text-muted-foreground">Только вы можете видеть эту цель</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPrivacy("public")}
                className={`p-4 cursor-pointer transition-colors ${
                  privacy === "public" ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border ${
                    privacy === "public" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium">Публичная</p>
                    <p className="text-sm text-muted-foreground">Все пользователи могут видеть эту цель</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPrivacy("specific")}
                className={`p-4 cursor-pointer transition-colors ${
                  privacy === "specific" ? "bg-muted/30" : "hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border ${
                    privacy === "specific" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">Для определенных людей</p>
                    <p className="text-sm text-muted-foreground mb-3">Выберите пользователей по username</p>
                    {privacy === "specific" && (
                      <Input
                        value={sharedWith}
                        onChange={(e) => setSharedWith(e.target.value)}
                        className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                        placeholder="username1, username2, username3"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity"
            >
              Создать →
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/goals")}
              className="hover:bg-transparent text-muted-foreground hover:text-foreground"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoal;
