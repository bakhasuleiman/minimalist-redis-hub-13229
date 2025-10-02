import { useState } from "react";
import { FileText, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notesApi } from "@/lib/api";
import { toast } from "sonner";

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

interface NoteItemProps {
  note: Note;
  onNoteUpdate: (updatedNote: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

export const NoteItem = ({ note, onNoteUpdate, onNoteDelete }: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Название заметки не может быть пустым");
      return;
    }

    if (!editContent.trim()) {
      toast.error("Содержание заметки не может быть пустым");
      return;
    }

    try {
      setLoading(true);
      const response = await notesApi.update(note.id, {
        title: editTitle,
        content: editContent
      });
      onNoteUpdate(response.note);
      setIsEditing(false);
      toast.success("Заметка обновлена");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Ошибка при обновлении заметки");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту заметку?")) {
      return;
    }

    try {
      setLoading(true);
      await notesApi.delete(note.id);
      onNoteDelete(note.id);
      toast.success("Заметка удалена");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Ошибка при удалении заметки");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 border border-border rounded-md bg-muted/10">
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Название заметки"
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Содержание заметки"
            className="bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 resize-none focus-visible:ring-0 focus-visible:border-primary min-h-32"
            rows={6}
          />
          <div className="flex gap-2">
            <Button 
              onClick={saveEdit}
              disabled={loading}
              className="bg-transparent border-0 text-primary hover:opacity-70 transition-opacity text-sm"
            >
              Сохранить
            </Button>
            <Button 
              onClick={cancelEdit}
              disabled={loading}
              variant="ghost"
              className="hover:bg-transparent text-muted-foreground hover:text-foreground text-sm"
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 hover:bg-muted/30 transition-colors group">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{note.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                {note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(note.createdAt).toLocaleDateString('ru-RU')}
                </span>
                {note.user.username && (
                  <span className="text-xs text-muted-foreground">
                    • @{note.user.username}
                  </span>
                )}
                {note.privacy !== "PRIVATE" && (
                  <span className="text-xs text-muted-foreground">
                    • {note.privacy === "PUBLIC" ? "Публичная" : "Общая"}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={deleteNote}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};