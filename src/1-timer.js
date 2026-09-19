import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownIntervalId = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function renderTime({ days, hours, minutes, seconds }) {
  daysValue.textContent = String(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }

  datetimePicker.disabled = false;
  startButton.disabled = true;
}

function updateTimer() {
  const remainingTime = userSelectedDate.getTime() - Date.now();

  if (remainingTime <= 0) {
    renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    stopTimer();
    return;
  }

  const time = convertMs(remainingTime);
  renderTime(time);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      userSelectedDate = null;
      startButton.disabled = true;
      return;
    }

    if (selectedDate <= new Date()) {
      userSelectedDate = null;
      startButton.disabled = true;
      iziToast.error({
        title: '',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(datetimePicker, options);
startButton.disabled = true;

startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  startButton.disabled = true;
  datetimePicker.disabled = true;

  updateTimer();
  countdownIntervalId = setInterval(() => {
    const remainingTime = userSelectedDate.getTime() - Date.now();

    if (remainingTime <= 0) {
      renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      stopTimer();
      return;
    }

    const time = convertMs(remainingTime);
    renderTime(time);
  }, 1000);
});
