import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { feedApi } from "@/lib/api";
import { toast } from "sonner";

interface FeedItem {
  id: string;
  action: string;
  details: string;
  type: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
  };
}

const Feed = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await feedApi.getFeed();
      setFeedItems(response.activities);
    } catch (error) {
      console.error('Error loading feed:', error);
      toast.error('Ошибка при загрузке ленты');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Загрузка ленты...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Лента активности</h1>
          <p className="text-muted-foreground text-sm">
            Ваши действия в системе
          </p>
        </div>

        <div className="space-y-1">
          {feedItems.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Пока нет активности</p>
              <p className="text-sm text-muted-foreground mt-2">
                Создайте задачу, заметку или цель, чтобы увидеть свою активность
              </p>
            </div>
          ) : (
            feedItems.map((item, index) => (
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
                      {formatTimestamp(item.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
