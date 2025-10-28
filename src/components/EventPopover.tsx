import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface EventPopoverProps {
  isEditing: boolean;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventNotes: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
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
  onTitleChange,
  onDateChange,
  onTimeChange,
  onNotesChange,
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
    if (popoverRef.current && position) {
      const rect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = position.y;
      let left = position.x;

      // Adjust if popover goes off right edge
      if (left + rect.width > viewportWidth) {
        left = viewportWidth - rect.width - 20;
      }

      // Adjust if popover goes off bottom edge
      if (top + rect.height > viewportHeight) {
        top = viewportHeight - rect.height - 20;
      }

      // Ensure it doesn't go off top or left edges
      top = Math.max(20, top);
      left = Math.max(20, left);

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
      label: 'Interview or Join To PP',
      type: 'text' as const,
      value: eventDate,
      onChange: onDateChange,
      placeholder: '02/01/2019',
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
      className="fixed bg-white rounded-lg shadow-xl w-[380px] p-5 z-50 border border-gray-200"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? 'Edit Event' : 'Add Event'}
      </h3>

      <div className="space-y-3">
        {formFields.map((field) => (
          <div key={field.label}>
            <label className="block text-sm text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm text-gray-700 mb-1">Notes</label>
          <textarea
            value={eventNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Culpa sit ex veniam qui quis..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          />
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            {isEditing ? 'DISCARD' : 'CANCEL'}
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
          >
            {isEditing ? 'EDIT' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopover;
