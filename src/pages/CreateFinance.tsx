import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CreateFinance = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      toast.error("Заполните все поля");
      return;
    }
    toast.success("Транзакция добавлена");
    navigate("/finance");
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/finance")}
          className="mb-6 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold mb-8">Новая транзакция</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm mb-3 block">Тип *</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 p-4 text-left transition-colors ${
                  type === "expense" 
                    ? "bg-muted" 
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="font-medium">Расход</div>
                <div className="text-sm text-muted-foreground">Покупка, оплата</div>
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 p-4 text-left transition-colors ${
                  type === "income" 
                    ? "bg-muted" 
                    : "hover:bg-muted/30"
                }`}
              >
                <div className="font-medium">Доход</div>
                <div className="text-sm text-muted-foreground">Зарплата, продажа</div>
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="title" className="text-sm mb-2 block">
              Название *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder="На что потрачено/получено?"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm mb-2 block">
              Сумма *
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder="0"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity"
            >
              Добавить →
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/finance")}
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

export default CreateFinance;
