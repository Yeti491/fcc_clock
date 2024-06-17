import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

function MyApp() {

  const [timeBreak, setTimeBreak] = useState(5);
  const [timeSession, setTimeSession] = useState(25);
  const [timeLeft, setTimeLeft] = useState(timeSession * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  let interval;

  //increment and decrement break and sesstion setting
  const breakDecrement = () => {
    if (timeBreak > 1) {
      setTimeBreak(timeBreak - 1);
    }
  };

  const breakIncrement = () => {
    if (timeBreak < 60) {
      setTimeBreak(timeBreak + 1);
    }
  };

  const sessionDecrement = () => {
    if (timeSession > 1) {
      setTimeSession(timeSession - 1);
      setTimeLeft((timeSession - 1) * 60);
    }
  };

  const sessionIncrement = () => {
    if (timeSession < 60) {
      setTimeSession(timeSession + 1);
      setTimeLeft((timeSession + 1) * 60);
    }
  };

  const timerStartStop = () => {
    setIsRunning(!isRunning)
  }

  const timerReset = () => {
    setTimeBreak(5);
    setTimeSession(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    if (isRunning) {
      // eslint-disable-next-line
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 0 && isSession) {
            setIsSession(false);
            setIsRunning(false);

            //to play audio
            audioRef.current.play();
            setIsRunning(true);
            setTimeLeft(timeBreak * 60);
            setTimeout(() => {
              audioRef.current.pause();
            }, 5000);
            clearInterval(intervalRef.current);
            return 0;
          } else if (prevTimeLeft <= 0 && !isSession) {
            setIsSession(true);
            setIsRunning(false);

            //to play audio
            audioRef.current.play();
            setIsRunning(true);
            setTimeLeft(timeSession * 60);
            setTimeout(() => {
              audioRef.current.pause();
            }, 5000);
            clearInterval(intervalRef.current);
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [isRunning, isSession, timeBreak, timeSession]);

  //display the current session time and break time
  const timeDisplay = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return (
    <div>
      <h1>25 + 5 Clock</h1>

      <div class='length'>
        <div class='row'>
          <div class='col'>
            <h2 id='break-label'>Break Length</h2>
            <div class='col-content'>
              <button id='break-decrement' onClick={breakDecrement}>-</button>
              <p id='break-length'>{timeBreak}</p>
              <button id='break-increment' onClick={breakIncrement}>+</button>
            </div>
          </div>
          <div class='col'>
            <h2 id='session-label'>Session Length</h2>
            <div class='col-content'>
              <button id='session-decrement' onClick={sessionDecrement}>-</button>
              <p id='session-length'>{timeSession}</p>
              <button id='session-increment' onClick={sessionIncrement}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 id='timer-label'>{isSession ? 'Session' : 'Break'}</h2>
        <div id='time-left'>{timeDisplay(timeLeft)}</div>
        <button id='start_stop' onClick={timerStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
        <button id='reset' onClick={timerReset}>Reset</button>
      </div>
      <audio ref={audioRef} id='beep' src="/song.mp3" />
    </div>
  )  
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MyApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
