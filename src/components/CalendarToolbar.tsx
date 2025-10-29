import moment from 'moment';
import type { View } from 'react-big-calendar';
import CalendarButtonSection from './CalendarButtonSection.tsx';

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
        <CalendarButtonSection
          buttons={viewButtons}
          onButtonClick={(value) => onViewChange(value)}
          checkValue={view}
        ></CalendarButtonSection>
      </div>
      <div className="flex relative items-center mb-6">
        <CalendarButtonSection
          buttons={navigationButtons}
          checkValue={view}
          className={''}
        ></CalendarButtonSection>

        <h2 className="text-xl font-medium mx-auto text-gray-700">
          {moment(date).format(view === 'day' ? 'DD MMMM YYYY' : 'MMMM YYYY')}
        </h2>
        <CalendarButtonSection
          buttons={navigationButtons}
          checkValue={view}
          className={'invisible pointer-events-none'}
        ></CalendarButtonSection>
      </div>
    </div>
  );
};

export default CalendarToolbar;
