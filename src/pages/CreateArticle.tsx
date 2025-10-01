import { useState } from "react";
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
  const navigate = useNavigate();

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
