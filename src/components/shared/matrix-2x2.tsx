import { forwardRef } from "react";
import { EditableCell } from "./editable-cell";
import { cn } from "@/lib/utils";

interface MatrixCell {
  label: string;
  color: string;
  textColor?: string;
  value: string;
  placeholder: string;
}

interface Matrix2x2Props {
  title: string;
  onTitleChange: (title: string) => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisValues?: [string, string];
  yAxisValues?: [string, string];
  cells: [MatrixCell, MatrixCell, MatrixCell, MatrixCell];
  onCellChange: (index: number, value: string) => void;
}

export const Matrix2x2 = forwardRef<HTMLDivElement, Matrix2x2Props>(
  (
    {
      title,
      onTitleChange,
      xAxisLabel,
      yAxisLabel,
      xAxisValues,
      yAxisValues,
      cells,
      onCellChange,
    },
    ref
  ) => {
    return (
      <div ref={ref} className="bg-background p-4 sm:p-6 rounded-xl">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl sm:text-2xl font-bold text-center w-full bg-transparent outline-none mb-4 sm:mb-6 text-foreground"
          placeholder="Titulo da Matriz"
        />

        <div className="flex">
          {/* Y Axis Label */}
          {yAxisLabel && (
            <div className="flex items-center mr-2">
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground [writing-mode:vertical-lr] rotate-180">
                {yAxisLabel}
              </span>
            </div>
          )}

          <div className="flex-1">
            {/* Y axis values + X axis labels */}
            {(xAxisValues || yAxisValues) && (
              <div className="flex mb-1">
                {yAxisValues && <div className="w-16 sm:w-20" />}
                {xAxisValues && (
                  <div className="flex-1 grid grid-cols-2 gap-1">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                      {xAxisValues[0]}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                      {xAxisValues[1]}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex">
              {/* Y axis values */}
              {yAxisValues && (
                <div className="flex flex-col w-16 sm:w-20 mr-1">
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                      {yAxisValues[0]}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                      {yAxisValues[1]}
                    </span>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="flex-1 grid grid-cols-2 gap-1 sm:gap-1.5">
                {cells.map((cell, i) => (
                  <div
                    key={i}
                    className="rounded-lg border overflow-hidden"
                    style={{ backgroundColor: `${cell.color}15` }}
                  >
                    <EditableCell
                      value={cell.value}
                      onChange={(val) => onCellChange(i, val)}
                      placeholder={cell.placeholder}
                      label={cell.label}
                      labelClassName={cn("border-b")}
                      minHeight="100px"
                      className="text-foreground"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* X Axis Label */}
            {xAxisLabel && (
              <div className="text-center mt-2">
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  {xAxisLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Matrix2x2.displayName = "Matrix2x2";
