import moment from 'moment';
import type { View } from 'react-big-calendar';
import cn from '../helpers/cn.ts';

interface CalendarToolbarProps {
  date: Date;
  view: View;
  onToday: () => void;
  onBack: () => void;
  onNext: () => void;
  onViewChange: (view: View) => void;
}

const CalendarToolbar = ({
  date,
  view,
  onToday,
  onBack,
  onNext,
  onViewChange,
}: CalendarToolbarProps) => {
  const navigationButtons = [
    { label: 'Today', onClick: onToday },
    { label: 'Back', onClick: onBack },
    { label: 'Next', onClick: onNext },
  ];
  const viewButtons: { value: View; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
    { value: 'agenda', label: 'Agenda' },
  ];

  return (
    <div>
      <div className={'flex gap-2 flex-wrap mb-1 justify-between'}>
        <h2 className={'text-lg text-[#4D4F5C]'}>Calendar View</h2>
        <div className="flex border rounded-sm border-gray-300 ">
          {viewButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onViewChange(btn.value)}
              className={cn(
                `px-3 py-1 not-last:border-r border-gray-300 rounded text-sm`,
                {
                  'text-[#3B86FF]': view === btn.value,
                }
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex border rounded-sm border-gray-300">
          {navigationButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className="px-4 py-2 bg-white not-last:border-r border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              {btn.label}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-medium text-gray-700">
          {moment(date).format(view === 'day' ? 'DD MMMM YYYY' : 'MMMM YYYY')}
        </h2>

        <div className="flex invisible pointer-events-none border rounded-sm border-gray-300">
          {navigationButtons.map((btn) => (
            <button
              key={btn.label}
              className="px-4 py-2 bg-white not-last:border-r border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
