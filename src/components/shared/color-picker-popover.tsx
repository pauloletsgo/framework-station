interface ColorPickerPopoverProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorPickerPopover({
  colors,
  selectedColor,
  onSelect,
}: ColorPickerPopoverProps) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-md z-50"
      style={{ backgroundColor: "rgba(40,40,40,0.95)" }}
      data-testid="bg-color-picker"
    >
      <div className="flex flex-wrap gap-2 justify-center max-w-[280px]">
        {colors.map((color) => (
          <button
            key={color}
            data-testid={`bg-color-${color.replace("#", "")}`}
            onClick={() => onSelect(color)}
            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 shrink-0"
            style={{
              backgroundColor: color,
              borderColor: selectedColor === color ? "#fff" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
