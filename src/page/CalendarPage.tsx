import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../assets/style/calendar.css';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CalendarToolbar from '../components/CalendarToolbar';
import EventPopover from '../components/EventPopover';
import { useEventForm } from '../hooks/useEventForm';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop<Event>(Calendar);

interface Event {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState<View>(
    (localStorage.getItem('view') as View) || 'month'
  );
  const [date, setDate] = useState(new Date());
  const [popoverPosition, setPopoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const {
    eventTitle,
    eventDate,
    eventTime,
    eventNotes,
    eventColor,
    setEventTitle,
    setEventDate,
    setEventTime,
    setEventNotes,
    setEventColor,
    setFormFromDate,
    setFormFromEvent,
    getEventDataFromForm,
    isFormValid,
  } = useEventForm();

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      setEvents(
        parsed.map((e: any) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }))
      );
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const handleSelectSlot = ({
    start,
    end,
    box,
  }: {
    start: Date;
    end: Date;
    box?: { x: number; y: number; clientX: number; clientY: number };
  }) => {
    if (start < new Date()) {
      return;
    }
    setCurrentEvent({ start, end });
    setFormFromDate(start);
    setIsEditing(false);
    setShowModal(true);

    // Set popover position based on click location
    if (box) {
      setPopoverPosition({ x: box.clientX + 10, y: box.clientY + 10 });
    } else {
      // Fallback to center if no box info
      setPopoverPosition({
        x: window.innerWidth / 2 - 190,
        y: window.innerHeight / 2 - 200,
      });
    }
  };

  const handleSelectEvent = (event: Event, e: React.SyntheticEvent) => {
    const mouseEvent = e.nativeEvent as MouseEvent;
    setCurrentEvent(event);
    setFormFromEvent(event);
    setIsEditing(true);
    setShowModal(true);
    setPopoverPosition({
      x: mouseEvent.clientX + 10,
      y: mouseEvent.clientY + 10,
    });
  };

  const handleSaveEvent = () => {
    if (!isFormValid()) return;

    const { startDate, endDate } = getEventDataFromForm();

    if (isEditing && currentEvent?.id) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === currentEvent.id
            ? {
                ...e,
                title: eventTitle,
                start: startDate,
                end: endDate,
                color: eventColor,
              }
            : e
        )
      );
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventTitle,
        start: startDate,
        end: endDate,
        color: eventColor,
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    setShowModal(false);
    setCurrentEvent(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEvent(null);
    setPopoverPosition(null);
  };

  const handleDeleteEvent = () => {
    if (currentEvent?.id) {
      setEvents((prev) => prev.filter((e) => e.id !== currentEvent.id));
    }
    handleCloseModal();
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    localStorage.setItem('view', newView);
    setView(newView);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const goToBack = () => {
    const v: Record<View, 'month' | 'day' | 'week'> = {
      month: 'month',
      week: 'week',
      work_week: 'week',
      day: 'day',
      agenda: 'day',
    };
    setDate(moment(date).subtract(1, v[view]).toDate());
  };

  const goToNext = () => {
    const v: Record<View, 'month' | 'day' | 'week'> = {
      month: 'month',
      week: 'week',
      work_week: 'week',
      day: 'day',
      agenda: 'day',
    };
    setDate(moment(date).add(1, v[view]).toDate());
  };

  const handleEventDrop = ({
    event,
    start,
    end,
  }: {
    event: Event;
    start: string | Date;
    end: string | Date;
  }) => {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, start: startDate, end: endDate } : e
      )
    );
  };

  // Пример: настройка стилей для слотов (ячеек времени)
  const slotPropGetter = (date: Date) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return {
      className: isWeekend ? 'calendar-weekend' : '',
      style: {
        cursor: date < new Date() ? 'not-allowed' : undefined,
      },
    };
  };

  // Пример: настройка стилей для дней
  const dayPropGetter = (date: Date) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isToday = moment(date).isSame(new Date(), 'day');

    return {
      className: isWeekend ? 'calendar-weekend' : '',
      style: isToday ? { fontWeight: 'bold' } : {},
    };
  };

  // Custom date header format for week view
  const customDateHeader = ({ date }: { date: Date }) => {
    const dayName = moment(date).format('ddd');
    const monthDate = moment(date).format('MM/DD');
    return `${dayName} ${monthDate}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[28px] text-[#43425D] mb-6 font-semibold">
        Calendar
      </h1>

      <div className="flex flex-1 flex-col p-8 shadow-[0px_2px_6px_rgba(0,0,0,0.04)] bg-white rounded-lg">
        <CalendarToolbar
          date={date}
          view={view}
          onToday={goToToday}
          onBack={goToBack}
          onNext={goToNext}
          onViewChange={handleViewChange}
        />

        <div className={' flex-1'}>
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            view={view}
            date={date}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            selectable
            toolbar={false}
            slotPropGetter={slotPropGetter}
            dayPropGetter={dayPropGetter}
            components={{
              timeGutterHeader: () => <div style={{ padding: '8px' }}></div>,
              week: {
                header: customDateHeader,
              },
              day: {
                header: customDateHeader,
              },
            }}
            eventPropGetter={(event: Event) => ({
              style: {
                backgroundColor: event.color || '#3B86FF',
              },
            })}
          />
        </div>
      </div>

      {showModal && (
        <EventPopover
          isEditing={isEditing}
          eventTitle={eventTitle}
          eventDate={eventDate}
          eventTime={eventTime}
          eventNotes={eventNotes}
          eventColor={eventColor}
          onTitleChange={setEventTitle}
          onDateChange={setEventDate}
          onTimeChange={setEventTime}
          onNotesChange={setEventNotes}
          onColorChange={setEventColor}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={handleCloseModal}
          position={popoverPosition}
        />
      )}
    </div>
  );
};

export default CalendarPage;
