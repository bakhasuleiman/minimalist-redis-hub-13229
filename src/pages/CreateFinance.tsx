import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { financeApi } from "@/lib/api";

const CreateFinance = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [privacy, setPrivacy] = useState<"private" | "public" | "specific">("private");
  const [sharedWith, setSharedWith] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/finance");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      toast.error("Заполните все поля");
      return;
    }
    
    setLoading(true);
    try {
      await financeApi.create({
        title: title.trim(),
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        currency,
        privacy: privacy.toUpperCase(),
        sharedWith: privacy === "specific" ? sharedWith.split(',').map(s => s.trim()).filter(Boolean) : undefined
      });
      toast.success("Транзакция добавлена");
      navigate("/finance");
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(error.message || "Ошибка при создании транзакции");
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Основная информация
            </h2>
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
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary flex-1"
                  placeholder="0"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-sm w-20"
                >
                  <option value="RUB">₽</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                  <option value="CNY">¥</option>
                </select>
              </div>
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
                    <p className="text-sm text-muted-foreground">Только вы можете видеть эту транзакцию</p>
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
                    <p className="text-sm text-muted-foreground">Все пользователи могут видеть эту транзакцию</p>
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
              disabled={loading}
              className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              {loading ? "Добавление..." : "Добавить →"}
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
