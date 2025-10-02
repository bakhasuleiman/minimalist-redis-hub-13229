import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public" | "specific">("private");
  const [sharedWith, setSharedWith] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/notes");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Введите название заметки");
      return;
    }
    toast.success("Заметка создана");
    navigate("/notes");
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/notes")}
          className="mb-6 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold mb-8">Новая заметка</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Основная информация
            </h2>
            <div>
              <Label htmlFor="title" className="text-sm mb-2 block">
                Название *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                placeholder="О чем заметка?"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm mb-2 block">
                Содержание
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 min-h-64 resize-none focus-visible:ring-0 focus-visible:border-primary"
                placeholder="Начните писать..."
              />
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
                    <p className="text-sm text-muted-foreground">Только вы можете видеть эту заметку</p>
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
                    <p className="text-sm text-muted-foreground">Все пользователи могут видеть эту заметку</p>
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
              className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity"
            >
              Создать →
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/notes")}
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

export default CreateNote;
