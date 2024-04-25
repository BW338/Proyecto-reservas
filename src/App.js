import React, { useState } from 'react';
import './App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [datesWithTimes, setDatesWithTimes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [isReservationCancelled, setIsReservationCancelled] = useState(false);

  const handleDayPress = (date) => {
    if (selectedDate && date.toISOString() === selectedDate.toISOString()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const handleTimeSlotClick = (hour) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const timesForDate = datesWithTimes[dateString] || [];
    if (timesForDate.includes(hour)) {
      setShowModal(true);
      setSelectedHour(hour);
      setIsReservationCancelled(true);
    } else {
      setShowModal(true);
      setSelectedHour(hour);
      setIsReservationCancelled(false);
    }
  };

  const handleConfirmReservation = () => {
    setShowModal(false);
    const dateString = selectedDate.toISOString().split('T')[0];
    const timesForDate = datesWithTimes[dateString] || [];
    if (isReservationCancelled) {
      setDatesWithTimes({
        ...datesWithTimes,
        [dateString]: timesForDate.filter((time) => time !== selectedHour),
      });
    } else {
      if (!timesForDate.includes(selectedHour)) {
        setDatesWithTimes({
          ...datesWithTimes,
          [dateString]: [...timesForDate, selectedHour],
        });
      }
    }
  };

  const renderTimeSlots = () => {
    const columns = [[], [], []];
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const selectedTimes = datesWithTimes[dateString] || [];
      for (let hour = 9; hour <= 23; hour++) {
        const column = Math.floor((hour - 9) / 5);
        const isSelected = selectedTimes.includes(hour);
        columns[column] = columns[column] || [];
        columns[column].push(
          <div
            key={hour}
            className={`time-slot ${isSelected ? 'selected' : ''}`}
            onClick={() => handleTimeSlotClick(hour)}
          >
            {hour < 10 ? '0' + hour : hour}:00
          </div>
        );
      }
    }
    return columns.map((column, index) => (
      <div key={index} className="time-column">
        {column}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="titulo">Proyecto reservas.</p>
      </header>
      <main className='cuerpo'>
        <div className="calendar-container">
          <Calendar value={selectedDate} onClickDay={handleDayPress} />
        </div>
        {selectedDate && (
          <div className="time-slots-container">
            <h3>Horarios disponibles para {selectedDate.toLocaleDateString()}</h3>
            <div className="time-slots">
              {renderTimeSlots()}
            </div>
          </div>
        )}
      </main>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              {isReservationCancelled
                ? `¿Quieres cancelar la reserva del horario ${selectedHour}:00 del día ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })} ${selectedDate.getDate()} de ${selectedDate.toLocaleDateString('es-ES', { month: 'long' })}?`
                : `¿Quieres reservar el horario ${selectedHour}:00 del día ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })} ${selectedDate.getDate()} de ${selectedDate.toLocaleDateString('es-ES', { month: 'long' })}?`}
            </p>
            <button onClick={handleConfirmReservation}>Sí</button>
            <button onClick={() => setShowModal(false)}>No</button>
          </div>
        </div>
      )}
      <footer>
        <p>Objetivo: Mostrar horarios disponibles al seleccionar una fecha en el calendario.</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </footer>
    </div>
  );
}

export default App;
