import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HotkeyHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HotkeyHelp = ({ open, onOpenChange }: HotkeyHelpProps) => {
  const hotkeys = [
    { section: "Навигация", keys: [
      { key: "1", description: "Задачи" },
      { key: "2", description: "Заметки" },
      { key: "3", description: "Планы и Цели" },
      { key: "4", description: "Финансы" },
      { key: "5", description: "Лента" },
      { key: "6", description: "Статьи" },
    ]},
    { section: "Действия", keys: [
      { key: "C или N", description: "Создать новый элемент" },
      { key: "Esc", description: "Вернуться назад" },
      { key: "?", description: "Показать эту подсказку" },
    ]},
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Горячие клавиши</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {hotkeys.map((section) => (
            <div key={section.section}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {section.section}
              </h3>
              <div className="space-y-2">
                {section.keys.map((hotkey) => (
                  <div
                    key={hotkey.key}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm">{hotkey.description}</span>
                    <kbd className="px-3 py-1 text-xs font-mono bg-muted text-foreground rounded">
                      {hotkey.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Горячие клавиши не работают при вводе текста в поля
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default HotkeyHelp;
