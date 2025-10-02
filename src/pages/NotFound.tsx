import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Страница не найдена</h2>
        <p className="text-muted-foreground mb-8">
          К сожалению, запрашиваемая страница не существует или была перемещена
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity">
              <Home className="h-4 w-4 mr-2" />
              На главную
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
