import { Link } from "react-router-dom";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
}

const Finance = () => {
  const transactions: Transaction[] = [
    { id: "1", title: "Зарплата", amount: 100000, type: "income", date: new Date() },
    { id: "2", title: "Продукты", amount: 5000, type: "expense", date: new Date() },
    { id: "3", title: "Подписка Netflix", amount: 990, type: "expense", date: new Date() },
    { id: "4", title: "Фриланс проект", amount: 30000, type: "income", date: new Date() },
  ];

  const balance = transactions.reduce((acc, t) => 
    acc + (t.type === "income" ? t.amount : -t.amount), 0
  );

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Финансы</h1>
            <p className="text-2xl font-semibold text-primary">
              {balance.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <Link to="/finance/create">
            <Button className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity">
              <Plus className="h-5 w-5 mr-2" />
              Добавить
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                {transaction.type === "income" ? (
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-medium">{transaction.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date.toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === "income" ? "text-primary" : "text-foreground"
              }`}>
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finance;
