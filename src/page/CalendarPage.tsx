import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../assets/style/calendar.css';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
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
  notes?: string;
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
  const [lastError, setLastError] = useState<string | null>(null);

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
      try {
        const parsed = JSON.parse(storedEvents);
        setEvents(
          parsed.map((e: any) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
      } catch (err) {
        // Corrupted data - clear it
        localStorage.removeItem('events');
      }
    }
  }, []);

  // Save events to localStorage (always sync; remove key when empty)
  useEffect(() => {
    try {
      if (events.length === 0) {
        localStorage.removeItem('events');
      } else {
        localStorage.setItem('events', JSON.stringify(events));
      }
    } catch (err) {
      // ignore storage errors
      console.warn('Failed to persist events', err);
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
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    // Prevent selecting slots in the past (compare by minute precision)
    if (moment(start).isBefore(moment(now), 'minute')) {
      setLastError('Cannot create events in the past');
      setTimeout(() => setLastError(null), 2500);
      return;
    }

    setCurrentEvent({ start, end });
    setFormFromDate(start);
    setIsEditing(false);
    setShowModal(true);

    // Set popover position based on click location
    if (box) {
      setPopoverPosition({ x: box.clientX + 10, y: box.clientY + 10 });
    } else if ((window as any).event) {
      const ev = (window as any).event as MouseEvent;
      setPopoverPosition({ x: ev.clientX + 10, y: ev.clientY + 10 });
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

  const computeTextColor = (bg: string) => {
    try {
      // Remove # if present
      const hex = bg.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      // Perceived luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.6 ? '#111827' : '#ffffff';
    } catch (err) {
      return '#ffffff';
    }
  };

  const handleSaveEvent = useCallback(() => {
    setLastError(null);
    if (!isFormValid()) return;

    const { startDate, endDate } = getEventDataFromForm();

    // Validate times: end must be after start
    if (moment(endDate).isBefore(moment(startDate))) {
      setLastError('End time must be after start time');
      setTimeout(() => setLastError(null), 3500);
      return;
    }

    // Prevent creating events in the past
    if (moment(startDate).isBefore(moment(), 'minute')) {
      setLastError('Cannot create events in the past');
      setTimeout(() => setLastError(null), 3500);
      return;
    }

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
                notes: eventNotes,
              }
            : e
        )
      );
    } else {
      const id =
        typeof crypto !== 'undefined' && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : Date.now().toString();

      const newEvent: Event = {
        id,
        title: eventTitle,
        start: startDate,
        end: endDate,
        color: eventColor,
        notes: eventNotes,
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    setShowModal(false);
    setCurrentEvent(null);
  }, [
    isEditing,
    currentEvent,
    eventTitle,
    eventColor,
    eventNotes,
    isFormValid,
    getEventDataFromForm,
  ]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setCurrentEvent(null);
    setPopoverPosition(null);
    setLastError(null);
  }, []);

  const handleDeleteEvent = useCallback(() => {
    if (currentEvent?.id) {
      setEvents((prev) => prev.filter((e) => e.id !== currentEvent.id));
    }
    handleCloseModal();
  }, [currentEvent, handleCloseModal]);

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

  const handleEventDrop = useCallback(
    ({
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

      // Prevent dropping events into the past
      if (moment(startDate).isBefore(moment(), 'minute')) {
        setLastError('Cannot move events into the past');
        setTimeout(() => setLastError(null), 3000);
        return;
      }

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, start: startDate, end: endDate } : e
        )
      );
    },
    []
  );

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
                color: computeTextColor(event.color || '#3B86FF'),
              },
            })}
          />
        </div>
      </div>

      {lastError && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-3 py-2 rounded shadow z-50 text-sm">
          {lastError}
        </div>
      )}

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
