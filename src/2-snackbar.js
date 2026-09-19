import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(form);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
        return;
      }

      reject(delay);
    }, delay);
  });

  promise
    .then(value => {
      iziToast.success({
        title: '✅',
        message: `Fulfilled promise in ${value}ms`,
        position: 'topRight',
      });
    })
    .catch(value => {
      iziToast.error({
        title: '❌',
        message: `Rejected promise in ${value}ms`,
        position: 'topRight',
      });
    });
});
