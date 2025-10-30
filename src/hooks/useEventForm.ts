import { useState } from 'react';
import moment from 'moment';

interface Event {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string;
  notes?: string;
}

export const useEventForm = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventColor, setEventColor] = useState('#3B86FF');

  const resetForm = () => {
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventNotes('');
    setEventColor('#3B86FF');
  };

  const setFormFromEvent = (event: Event | Partial<Event>) => {
    setEventTitle(event.title || '');
    if (event.start && moment(event.start).isValid()) {
      const m = moment(event.start);
      setEventDate(m.format('MM/DD/YYYY'));
      setEventTime(m.format('HH:mm'));
    } else {
      // fallback to today if start is missing/invalid
      setEventDate(moment().format('MM/DD/YYYY'));
      setEventTime(moment().format('HH:mm'));
    }
    setEventNotes(event.notes || '');
    setEventColor(event.color || '#3B86FF');
  };

  const setFormFromDate = (start: Date) => {
    setEventTitle('');
    if (start && moment(start).isValid()) {
      const m = moment(start);
      setEventDate(m.format('MM/DD/YYYY'));
      setEventTime(m.format('HH:mm'));
    } else {
      setEventDate(moment().format('MM/DD/YYYY'));
      setEventTime(moment().format('HH:mm'));
    }
    setEventNotes('');
    setEventColor('#3B86FF');
  };

  const getEventDataFromForm = () => {
    const [hourStr, minuteStr] = eventTime.split(':');
    const hour = parseInt(hourStr || '0', 10);
    const minute = parseInt(minuteStr || '0', 10);

    const startDate = moment(eventDate, 'MM/DD/YYYY')
      .set({
        hour: Number.isNaN(hour) ? 0 : hour,
        minute: Number.isNaN(minute) ? 0 : minute,
      })
      .toDate();

    // Default end = start + 1 hour
    const endDate = moment(startDate).add(1, 'hour').toDate();

    return { startDate, endDate };
  };

  const isFormValid = () => {
    // Basic validation: title, date and time required, title length limit
    if (eventTitle.trim() === '' || eventTitle.length > 30) return false;
    if (!eventDate) return false;
    if (!eventTime) return false;

    // Ensure start date parses
    const { startDate } = getEventDataFromForm();
    return !isNaN(startDate.getTime());
  };

  return {
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
    resetForm,
    setFormFromEvent,
    setFormFromDate,
    getEventDataFromForm,
    isFormValid,
  };
};
