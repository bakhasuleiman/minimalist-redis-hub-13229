import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
}

const Notes = () => {
  const notes: Note[] = [
    { 
      id: "1", 
      title: "Идеи для проекта", 
      preview: "Минималистичный дизайн, черно-белая палитра...",
      createdAt: new Date() 
    },
    { 
      id: "2", 
      title: "Заметки по дизайну", 
      preview: "Использовать моноширинный шрифт, без обводок...",
      createdAt: new Date() 
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Заметки</h1>
            <p className="text-muted-foreground text-sm">{notes.length} заметок</p>
          </div>
          <Link to="/notes/create">
            <Button className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity">
              <Plus className="h-5 w-5 mr-2" />
              Создать
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 hover:bg-muted/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">{note.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
