import { Check, X } from 'lucide-react';
import React from 'react';

interface Color {
  name: string;
  value: string;
}

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  onClose?: () => void;
  inline?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onChange,
  onClose,
  inline = false,
}) => {
  const colors: Color[] = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Black", value: "#1F2937" },
    { name: "Violet", value: "#4B145B" },
    { name: "Navy", value: "#2c2a63" },
  ];

  const handleColorClick = (colorValue: string) => {
    onChange(colorValue);
    if (!inline && onClose) onClose();
  };

  // ── Inline mode (static sidebar) ────────────────────────────────────────
  if (inline) {
    return (
      <div className="flex flex-col">
        <p className="text-xs text-gray-500 mb-4">Choose an accent color for your resume</p>
        <div className="grid grid-cols-3 gap-4">
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative cursor-pointer flex flex-col items-center group"
              onClick={() => handleColorClick(color.value)}
            >
              <div
                className="w-14 h-14 rounded-full border-4 transition-all shadow-sm group-hover:shadow-md group-hover:scale-105"
                style={{
                  backgroundColor: color.value,
                  borderColor: selectedColor === color.value ? '#2c2a63' : 'transparent',
                  outline: selectedColor === color.value ? '2px solid #EDC9AF' : 'none',
                }}
              />
              {selectedColor === color.value && (
                <div className="absolute top-0 left-0 right-0 bottom-[20px] flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <Check className="w-4 h-4 text-[#2c2a63]" strokeWidth={3} />
                  </div>
                </div>
              )}
              <p className="text-[10px] text-center mt-2 font-medium text-gray-600">{color.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Modal/overlay mode (original) ──────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">Accent Colors</h2>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        )}
      </div>
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative cursor-pointer group flex flex-col items-center"
              onClick={() => handleColorClick(color.value)}
            >
              <div
                className="w-20 h-20 rounded-full border-2 transition-all shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: color.value,
                  borderColor: selectedColor === color.value ? '#2c2a63' : 'transparent'
                }}
              />
              {selectedColor === color.value && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Check className="w-5 h-5 text-[#2c2a63]" strokeWidth={3} />
                  </div>
                </div>
              )}
              <p className="text-sm text-center mt-3 font-medium text-gray-700">{color.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;