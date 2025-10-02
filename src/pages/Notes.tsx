import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { notesApi } from "@/lib/api";
import { toast } from "sonner";
import { NoteItem } from "@/components/NoteItem";

interface Note {
  id: string;
  title: string;
  content: string;
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

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await notesApi.getAll();
      setNotes(response.notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Ошибка при загрузке заметок');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Загрузка заметок...</p>
        </div>
      </div>
    );
  }

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleNoteDelete = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

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

        <div className="space-y-1">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onNoteUpdate={handleNoteUpdate}
              onNoteDelete={handleNoteDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
