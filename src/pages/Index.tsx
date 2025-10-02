import { Link } from "react-router-dom";
import { CheckCircle2, FileText, Target, TrendingUp, BookOpen, Activity } from "lucide-react";

const Index = () => {
  const stats = {
    tasks: { total: 12, completed: 8 },
    notes: 15,
    goals: { total: 5, inProgress: 3 },
    balance: 125000,
  };

  const quickLinks = [
    { icon: CheckCircle2, label: "Задачи", path: "/tasks", color: "text-primary" },
    { icon: FileText, label: "Заметки", path: "/notes", color: "text-primary" },
    { icon: Target, label: "Цели", path: "/goals", color: "text-primary" },
    { icon: TrendingUp, label: "Финансы", path: "/finance", color: "text-primary" },
    { icon: Activity, label: "Лента", path: "/feed", color: "text-primary" },
    { icon: BookOpen, label: "Статьи", path: "/articles", color: "text-primary" },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Productivity Hub</h1>
          <p className="text-muted-foreground">
            Управление задачами, заметками, целями и финансами в одном месте
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Задачи</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.tasks.completed}/{stats.tasks.total}</p>
            <p className="text-sm text-muted-foreground">Выполнено</p>
          </div>

          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Заметки</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.notes}</p>
            <p className="text-sm text-muted-foreground">Сохранено</p>
          </div>

          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Цели</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.goals.inProgress}/{stats.goals.total}</p>
            <p className="text-sm text-muted-foreground">В процессе</p>
          </div>

          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Баланс</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.balance.toLocaleString('ru-RU')}</p>
            <p className="text-sm text-muted-foreground">Рублей</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Быстрый доступ</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className="group flex items-center gap-4 p-6 hover:bg-muted/30 transition-colors"
              >
                <link.icon className={`h-8 w-8 ${link.color} group-hover:scale-110 transition-transform`} />
                <div>
                  <p className="font-semibold mb-1">{link.label}</p>
                  <p className="text-sm text-muted-foreground">Горячая клавиша: {index + 1}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
