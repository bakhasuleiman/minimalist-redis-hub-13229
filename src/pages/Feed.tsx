import { Clock } from "lucide-react";

interface FeedItem {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
}

const Feed = () => {
  const feedItems: FeedItem[] = [
    { 
      id: "1", 
      action: "Создана задача", 
      details: "Реализовать аутентификацию",
      timestamp: new Date(Date.now() - 1000 * 60 * 5) 
    },
    { 
      id: "2", 
      action: "Добавлена заметка", 
      details: "Идеи для проекта",
      timestamp: new Date(Date.now() - 1000 * 60 * 30) 
    },
    { 
      id: "3", 
      action: "Обновлен прогресс цели", 
      details: "Изучить TypeScript (80%)",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) 
    },
    { 
      id: "4", 
      action: "Добавлена транзакция", 
      details: "+30000 ₽ Фриланс проект",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) 
    },
  ];

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Лента активности</h1>
          <p className="text-muted-foreground text-sm">
            Последние действия в системе
          </p>
        </div>

        <div className="space-y-1">
          {feedItems.map((item, index) => (
            <div
              key={item.id}
              className="p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  {index !== feedItems.length - 1 && (
                    <div className="absolute left-1/2 top-8 -ml-px w-px h-8 bg-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-1">{item.action}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(item.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
