import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  preview: string;
  readTime: number;
  publishedAt: Date;
}

const Articles = () => {
  const articles: Article[] = [
    { 
      id: "1", 
      title: "Как создать минималистичный дизайн", 
      preview: "Принципы минимализма в UI/UX дизайне и их применение...",
      readTime: 5,
      publishedAt: new Date() 
    },
    { 
      id: "2", 
      title: "Управление задачами: мой подход", 
      preview: "Делюсь своим методом организации задач и планирования...",
      readTime: 8,
      publishedAt: new Date() 
    },
    { 
      id: "3", 
      title: "Финансовая грамотность для разработчиков", 
      preview: "Как эффективно управлять деньгами в IT сфере...",
      readTime: 10,
      publishedAt: new Date() 
    },
  ];

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
          {articles.map((article) => (
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
                  <p className="text-muted-foreground mb-3">{article.preview}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{article.readTime} мин чтения</span>
                    <span>·</span>
                    <span>{article.publishedAt.toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
