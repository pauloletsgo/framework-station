import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  minHeight?: string;
  labelClassName?: string;
}

export function EditableCell({
  value,
  onChange,
  placeholder = "Clique para editar...",
  label,
  className,
  minHeight = "120px",
  labelClassName,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div
      className={cn("flex flex-col h-full", className)}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {label && (
        <div className={cn("text-sm font-semibold px-3 py-2 border-b", labelClassName)}>
          {label}
        </div>
      )}
      <div className="flex-1 p-3" style={{ minHeight }}>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              autoResize();
            }}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full bg-transparent resize-none outline-none text-sm leading-relaxed"
            style={{ minHeight }}
            placeholder={placeholder}
          />
        ) : (
          <div
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap cursor-text min-h-full",
              !value && "text-muted-foreground italic"
            )}
          >
            {value || placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
