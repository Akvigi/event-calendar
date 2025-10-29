import cn from '../helpers/cn.ts';
import type { View } from 'react-big-calendar';

const CalendarButtonSection = ({
  buttons,
  checkValue,
  onButtonClick,
  className,
}: {
  buttons: {
    label: string;
    onClick?: () => void;
    value?: View;
  }[];
  onButtonClick?: (v: View) => void;
  checkValue?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex shadow-[0px_2px_3px_#0000000D] overflow-hidden border rounded-sm border-gray-300',
        className
      )}
    >
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={
            btn.onClick ||
            (btn.value === undefined
              ? undefined
              : () => onButtonClick?.(btn.value!))
          }
          className={cn(
            'first:last:min-w-[70px] py-2 bg-white px-4 not-last:border-r border-gray-300  text-[13px] text-gray-700 hover:bg-gray-50',
            {
              'text-[#3B86FF]': checkValue && btn.value === checkValue,
            }
          )}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default CalendarButtonSection;
