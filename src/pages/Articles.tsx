import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { articlesApi } from "@/lib/api";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  content: string;
  published: boolean;
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

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articlesApi.getAll(true); // Only published articles
      setArticles(response.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast.error('Ошибка при загрузке статей');
    } finally {
      setLoading(false);
    }
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const getPreview = (content: string, maxLength = 150) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + "..." 
      : content;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Загрузка статей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Статьи</h1>
            <p className="text-muted-foreground text-sm">{articles.length} опубликовано</p>
          </div>
          <Link to="/articles/create">
            <Button className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity">
              <Plus className="h-5 w-5 mr-2" />
              Написать
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Статей пока нет</p>
              <p className="text-sm text-muted-foreground mt-2">
                Создайте первую статью, чтобы поделиться своими мыслями
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <article
                key={article.id}
                className="p-6 hover:bg-muted/30 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-3">{getPreview(article.content)}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{getReadTime(article.content)} мин чтения</span>
                      <span>·</span>
                      <span>{new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span>·</span>
                      <span>{article.user.username || article.user.name}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;