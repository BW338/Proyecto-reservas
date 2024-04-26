import React, { useState, useEffect } from 'react';
import './App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBYBsRgO1RRAwVmhyI4byoX3lYev3DM2A8",
  authDomain: "reservas-5a992.firebaseapp.com",
  projectId: "reservas-5a992",
  storageBucket: "reservas-5a992.appspot.com",
  messagingSenderId: "462599081210",
  appId: "1:462599081210:web:3fa82efdeb4a663fa70d43",
  measurementId: "G-6081BT79YB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Elimina la llamada a getAnalytics
// const analytics = getAnalytics(app);
const db = getFirestore(app);

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [datesWithTimes, setDatesWithTimes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [isReservationCancelled, setIsReservationCancelled] = useState(false);
  const today = new Date();

  useEffect(() => {
    // Consulta los horarios de reserva de Firestore al cargar la aplicación
    const fetchData = async () => {
      const dateFormatted = selectedDate.toISOString().split('T')[0];
      const docRef = doc(db, "horarios", dateFormatted);
      const docSnap = await getDocs(docRef);
      if (docSnap.exists()) {
        setDatesWithTimes(docSnap.data());
      } else {
        // Si no hay datos para la fecha seleccionada, inicializa los horarios de reserva como vacíos
        setDatesWithTimes({});
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  const handleDayPress = (date) => {
    if (selectedDate && date.toISOString() === selectedDate.toISOString()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const handleTimeSlotClick = async (hour) => {
    if (!selectedDate) return;
  
    const dateString = selectedDate.toISOString().split('T')[0];
    const docRef = doc(db, "horarios", dateString);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const timesForDate = docSnap.data()[dateString] || [];
      setShowModal(true);
      setSelectedHour(hour);
      setIsReservationCancelled(timesForDate.includes(hour));
    }
  };
  

  const handleConfirmReservation = async () => {
    setShowModal(false);
    const dateString = selectedDate.toISOString().split('T')[0];
    let updatedTimesForDate = { ...datesWithTimes };
  
    if (isReservationCancelled) {
      updatedTimesForDate[dateString] = updatedTimesForDate[dateString].filter((time) => time !== selectedHour);
    } else {
      updatedTimesForDate[dateString] = [...(updatedTimesForDate[dateString] || []), selectedHour];
    }
  
    await updateDoc(doc(db, "horarios", dateString), updatedTimesForDate);
    setDatesWithTimes(updatedTimesForDate);
  };
  

  const renderTimeSlots = () => {
    const columns = [[], [], []];
    if (selectedDate) {
      for (let hour = 9; hour <= 23; hour++) {
        const column = Math.floor((hour - 9) / 5);
        const isSelected = (datesWithTimes[selectedDate.toISOString().split('T')[0]] || []).includes(hour);
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
          <Calendar
            value={selectedDate}
            onClickDay={handleDayPress}
            minDate={today}
          />
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
                ? <>¿Quieres <strong>cancelar</strong> la reserva del horario {selectedHour}:00 del día {selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })} {selectedDate.getDate()} de {selectedDate.toLocaleDateString('es-ES', { month: 'long' })}?</>
                : <>¿Quieres <strong>reservar</strong> el horario {selectedHour}:00 del día {selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })} {selectedDate.getDate()} de {selectedDate.toLocaleDateString('es-ES', { month: 'long' })}?</>}
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


