import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface EventPopoverProps {
  isEditing: boolean;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventNotes: string;
  eventColor: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  position: { x: number; y: number } | null;
}

const EventPopover = ({
  isEditing,
  eventTitle,
  eventDate,
  eventTime,
  eventNotes,
  eventColor,
  onTitleChange,
  onDateChange,
  onTimeChange,
  onNotesChange,
  onColorChange,
  onSave,
  onDelete,
  onClose,
  position,
}: EventPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (popoverRef.current && position) {
      const rect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = position.y;
      let left = position.x;

      // Adjust if popover goes off right edge
      if (left + rect.width > viewportWidth) {
        left = viewportWidth - rect.width - 12;
      }

      // Adjust if popover goes off bottom edge
      if (top + rect.height > viewportHeight) {
        top = viewportHeight - rect.height - 12;
      }

      // Ensure it doesn't go off top or left edges
      top = Math.max(12, top);
      left = Math.max(12, left);

      popoverRef.current.style.top = `${top}px`;
      popoverRef.current.style.left = `${left}px`;
    }
  }, [position]);

  const formFields = [
    {
      label: 'Event name',
      type: 'text' as const,
      value: eventTitle,
      onChange: onTitleChange,
      placeholder: 'Event name',
    },
    {
      label: 'Date',
      type: 'text' as const,
      value: eventDate,
      onChange: onDateChange,
      placeholder: '02/01/2019',
      disabled: true,
    },
    {
      label: 'Event time',
      type: 'time' as const,
      value: eventTime,
      onChange: onTimeChange,
      placeholder: '',
    },
  ];

  if (!position) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed bg-white rounded-lg shadow-xl w-[260px] p-3 z-50 border border-gray-200"
      style={{
        top: position.y,
        left: position.x,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit event' : 'Add event'}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Close popover"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-2">
        {formFields.map((field) => (
          <div key={field.label}>
            <label className="block text-xs text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              disabled={field.disabled}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.label === 'Event name' ? 30 : undefined}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              aria-label={field.label}
              autoFocus={field.label === 'Event name'}
            />
          </div>
        ))}

        <div>
          <label className="block text-xs text-gray-700 mb-1">Notes</label>
          <input
            value={eventNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Culpa sit ex veniam qui quis..."
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            aria-label="Notes"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-700 mb-1">Color</label>
          <div className="flex gap-2 flex-wrap">
            {[
              '#3B86FF',
              '#FF6B6B',
              '#4ECDC4',
              '#FFD93D',
              '#95E1D3',
              '#F38181',
              '#AA96DA',
              '#FCBAD3',
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onColorChange(color)}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  eventColor === color
                    ? 'border-gray-800 scale-105'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Choose color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-1">
          <button
            onClick={onDelete}
            className="px-3 py-1 text-red-500 hover:text-red-600 text-xs font-medium"
          >
            {isEditing ? 'DISCARD' : 'CANCEL'}
          </button>
          <button
            onClick={onSave}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium"
          >
            {isEditing ? 'EDIT' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopover;
