import { Link } from "react-router-dom";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { financeApi } from "@/lib/api";
import { toast } from "sonner";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  currency?: string;
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

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await financeApi.getAll();
      setTransactions(response.transactions);
      setBalance(response.balance);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Ошибка при загрузке транзакций');
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'CNY': return '¥';
      case 'RUB': 
      default: return '₽';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Загрузка транзакций...</p>
        </div>
      </div>
    );
  }

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
                {transaction.type === "INCOME" ? (
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-medium">{transaction.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === "INCOME" ? "text-primary" : "text-foreground"
              }`}>
                {transaction.type === "INCOME" ? "+" : "-"}
                {transaction.amount.toLocaleString('ru-RU')} {getCurrencySymbol(transaction.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finance;
