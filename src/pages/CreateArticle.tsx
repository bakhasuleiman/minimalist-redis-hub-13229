import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public" | "specific">("public");
  const [sharedWith, setSharedWith] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/articles");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Заполните все поля");
      return;
    }
    toast.success("Статья опубликована");
    navigate("/articles");
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/articles")}
          className="mb-6 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold mb-8">Новая статья</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Основная информация
            </h2>
            <div>
              <Label htmlFor="title" className="text-sm mb-2 block">
                Заголовок *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 text-2xl h-auto py-2 focus-visible:ring-0 focus-visible:border-primary font-semibold"
                placeholder="О чем статья?"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm mb-2 block">
                Содержание *
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 min-h-96 resize-none focus-visible:ring-0 focus-visible:border-primary text-base leading-relaxed"
                placeholder="Начните писать свою статью..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Настройки публикации
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
                    <p className="font-medium">Черновик</p>
                    <p className="text-sm text-muted-foreground">Только вы можете видеть эту статью</p>
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
                    <p className="text-sm text-muted-foreground">Все пользователи могут видеть эту статью</p>
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
                    <p className="text-sm text-muted-foreground mb-3">Выберите читателей по username</p>
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
              Опубликовать →
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/articles")}
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

export default CreateArticle;
