import React, { useState } from 'react';
import './App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleDayPress = (date) => {
    setSelectedDate(date);
    setSelectedTimes([]); // Limpiar los horarios seleccionados al cambiar la fecha
  };

  const handleTimeSlotClick = (hour) => {
    const index = selectedTimes.indexOf(hour);
    if (index !== -1) {
      // Si el horario ya está seleccionado, eliminarlo de la lista
      setSelectedTimes(selectedTimes.filter((time) => time !== hour));
    } else {
      // Si el horario no está seleccionado, añadirlo a la lista
      setSelectedTimes([...selectedTimes, hour]);
    }
  };

  const renderTimeSlots = () => {
    const columns = [[], [], []]; // Tres columnas vacías
    for (let hour = 9; hour <= 23; hour++) {
      const column = Math.floor((hour - 9) / 5); // Asigna cada hora a una columna: 0, 1, 2
      const isSelected = selectedTimes.includes(hour); // Verificar si el horario está seleccionado
      columns[column] = columns[column] || []; // Inicializar como array si no existe
      columns[column].push(
        <div
          key={hour}
          className={`time-slot ${isSelected ? 'selected' : ''}`} // Aplicar clase 'selected' si el horario está seleccionado
          onClick={() => handleTimeSlotClick(hour)}
        >
          {hour < 10 ? '0' + hour : hour}:00
        </div>
      );
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