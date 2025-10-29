import { useState } from 'react';
import moment from 'moment';

interface Event {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string;
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
    if (event.start) {
      setEventDate(moment(event.start).format('MM/DD/YYYY'));
      setEventTime(moment(event.start).format('HH:mm'));
    }
    setEventNotes('');
    setEventColor(event.color || '#3B86FF');
  };

  const setFormFromDate = (start: Date) => {
    setEventTitle('');
    setEventDate(moment(start).format('MM/DD/YYYY'));
    setEventTime(moment(start).format('HH:mm'));
    setEventNotes('');
    setEventColor('#3B86FF');
  };

  const getEventDataFromForm = () => {
    const startDate = moment(eventDate, 'MM/DD/YYYY')
      .set({
        hour: parseInt(eventTime.split(':')[0] || '0'),
        minute: parseInt(eventTime.split(':')[1] || '0'),
      })
      .toDate();

    const endDate = moment(startDate).add(1, 'hour').toDate();

    return { startDate, endDate };
  };

  const isFormValid = () => {
    return (
      eventTitle.trim() !== '' && eventTitle.length <= 30 && eventDate !== ''
    );
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
