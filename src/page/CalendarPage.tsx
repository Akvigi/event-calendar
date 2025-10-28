import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import CalendarToolbar from '../components/CalendarToolbar';
import EventPopover from '../components/EventPopover';
import { useEventForm } from '../hooks/useEventForm';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState<View>('month');
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
    setEventTitle,
    setEventDate,
    setEventTime,
    setEventNotes,
    setFormFromDate,
    setFormFromEvent,
    getEventDataFromForm,
    isFormValid,
  } = useEventForm();

  // Load events from localStorage
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

  const handleSelectSlot = useCallback(
    ({
      start,
      end,
      box,
    }: {
      start: Date;
      end: Date;
      box?: { x: number; y: number; clientX: number; clientY: number };
    }) => {
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
    },
    [setFormFromDate]
  );

  const handleSelectEvent = useCallback(
    (event: Event, e: React.SyntheticEvent) => {
      const mouseEvent = e.nativeEvent as MouseEvent;
      setCurrentEvent(event);
      setFormFromEvent(event);
      setIsEditing(true);
      setShowModal(true);
      setPopoverPosition({
        x: mouseEvent.clientX + 10,
        y: mouseEvent.clientY + 10,
      });
    },
    [setFormFromEvent]
  );

  const handleSaveEvent = () => {
    if (!isFormValid()) return;

    const { startDate, endDate } = getEventDataFromForm();

    if (isEditing && currentEvent?.id) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === currentEvent.id
            ? { ...e, title: eventTitle, start: startDate, end: endDate }
            : e
        )
      );
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventTitle,
        start: startDate,
        end: endDate,
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    setShowModal(false);
    setCurrentEvent(null);
  };

  const handleDeleteEvent = () => {
    if (currentEvent?.id) {
      setEvents((prev) => prev.filter((e) => e.id !== currentEvent.id));
    }
    setShowModal(false);
    setCurrentEvent(null);
    setPopoverPosition(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEvent(null);
    setPopoverPosition(null);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const goToBack = () => {
    if (view === 'month') {
      setDate(moment(date).subtract(1, 'month').toDate());
    } else if (view === 'week') {
      setDate(moment(date).subtract(1, 'week').toDate());
    } else if (view === 'day') {
      setDate(moment(date).subtract(1, 'day').toDate());
    }
  };

  const goToNext = () => {
    if (view === 'month') {
      setDate(moment(date).add(1, 'month').toDate());
    } else if (view === 'week') {
      setDate(moment(date).add(1, 'week').toDate());
    } else if (view === 'day') {
      setDate(moment(date).add(1, 'day').toDate());
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <h1 className="text-[28px] text-[#43425D] mb-6 font-semibold">
        Calendar View
      </h1>

      <div className="flex flex-1 flex-col p-8 shadow-[0px_2px_6px_rgba(0,0,0,0.04)] bg-white rounded-lg overflow-hidden">
        <CalendarToolbar
          date={date}
          view={view}
          onToday={goToToday}
          onBack={goToBack}
          onNext={goToNext}
          onViewChange={handleViewChange}
        />

        <div className="flex-1 min-h-0">
          <Calendar
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
            selectable
            toolbar={false}
            style={{ height: '100%', width: '100%' }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#3B86FF',
                borderRadius: '4px',
                border: 'none',
                color: 'white',
                fontSize: '13px',
                padding: '2px 6px',
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
          onTitleChange={setEventTitle}
          onDateChange={setEventDate}
          onTimeChange={setEventTime}
          onNotesChange={setEventNotes}
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
