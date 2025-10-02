import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Bug, X } from "lucide-react";

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"FEEDBACK" | "BUG">("FEEDBACK");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('auth_token') && {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          })
        },
        body: JSON.stringify({
          type,
          title: title.trim(),
          message: message.trim(),
          email: email.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      toast.success("Спасибо за обращение! Мы рассмотрим его в ближайшее время");
      setTitle("");
      setMessage("");
      setEmail("");
      setIsOpen(false);
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error("Ошибка при отправке обращения");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full p-4"
          size="lg"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Обратная связь
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-background border border-border rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Обратная связь</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-sm mb-2 block">Тип обращения</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "FEEDBACK" ? "default" : "outline"}
              size="sm"
              onClick={() => setType("FEEDBACK")}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Отзыв
            </Button>
            <Button
              type="button"
              variant={type === "BUG" ? "default" : "outline"}
              size="sm"
              onClick={() => setType("BUG")}
              className="flex-1"
            >
              <Bug className="h-4 w-4 mr-1" />
              Баг
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="title" className="text-sm">
            Тема *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Краткое описание..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm">
            Сообщение *
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Подробное описание..."
            rows={4}
            className="mt-1 resize-none"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm">
            Email (необязательно)
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ваш@email.com"
            className="mt-1"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Отправка..." : "Отправить"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackButton;