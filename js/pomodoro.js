/**Definimos un array con las duraciones que necesitamos */
const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
  };
  
  let interval;
  
  /** Hacemos una función que nos permita calcular cuanto tiempo va quedando ,
   * pasandole el tiempo real
  */
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    /**calculamos la diferencia, minutos y segundos */
  
    const total = parseInt(difference / 1000);
    const minutes = parseInt((total / 60) % 60);
    const seconds = parseInt(total % 60);

    /**devolvemos los valores */
  
    return {
      total,
      minutes,
      seconds,
    };
  }

  /**Creamos función para que el reloj se vaya actualizando */
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    /** Seleccionamos del documento los elementos que vamos a modificar
     * y le pasamos los datos previamente recolectados
     */
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    const time = `${minutes}:${seconds}`;
    min.textContent = minutes;
    sec.textContent = seconds;


    /**Insertamos dentro del titulo de la imagen el tiempo restante para si la persona
     * se encuentra en otra pestaña, de todos pueda ver cuanto tiempo falta para que termine
     * la cuenta regresiva
     */
    document.title = `${time} - Pomodoro Clock `;
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }

  /**Creamos función para iniciar el reloj donde pasamos el total del tiempo y el final
   */
  
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    /**Definimos las clases para que cuando demos click al start o stop
     * cambie dependiendo de lo que vamos a realizar
     */
  
    if (timer.mode === 'pomodoro') timer.sessions++;
  
    mainButton.dataset.action = 'stop';
    mainButton.classList.add('active');
    mainButton.textContent = 'stop';

    /**Definimos los intervalos y cuando se termina, se limpia el reloj y vuelve a la sección de trabajo con switch */
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      total = timer.remainingTime.total;
      updateClock();
      if (total <= 0) {
        clearInterval(interval);
  
        switch (timer.mode) {
          case 'pomodoro':
            if (timer.sessions % timer.longBreakInterval === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
            break;
          default:
            switchMode('pomodoro');
        }

        /**Definimos la notificación que vamos a mandar */
  
        if (Notification.permission === 'granted') {
          const text =
            timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
          new Notification(text);
        }

        /**Ponemos audio para que sea más dinámico y no se pierda la atención */
  
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
        startTimer();
      }
    }, 1000);
  }
  
  /**Definimos función para parar el reloj con los intervalos y acciones, removemos clases */
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.classList.remove('active');
    mainButton.textContent = 'start';
  }

  /**Difinimos función para que nos de el tiempo qeu resta*/
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };

    /**Seleccionamos los botones de arriba de la página, así vamos a poder cambiar de "página" y va a cambiar
     * el intervalo de tiempo y el color de fondo y pasamos la función de actualizar el reloj
     */
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document
      .getElementById('js-progress')
      .setAttribute('max', timer.remainingTime.total);
    document.body.style.backgroundColor = `var(--${mode})`;
  
    updateClock();
  }

  /**Definimos que cuando demos click se reinicie el modo del reloj */
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    timer.sessions = 0;
    switchMode(mode);
    stopTimer();
  }

  /**Añadimos el audio a nuestro botón */
  
  const buttonSound = new Audio('assets/button-sound.mp3');
  const mainButton = document.getElementById('js-btn');

  /**cuando se le de click al botón, el sonido va a empezar */
  mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    buttonSound.play();
    if (action === 'start') {
      startTimer();
    } else {
      stopTimer();
    }
  });

  /**Creamos el evento de click para que cuando se le de click, nos pase la función de handleMode
   * y se cambie el tiempo y color de fondo
   */
  
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);
  /**Se pide permiso para enviar notificaciones */
  document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          new Notification(
            'Awesome! You will receive notifications at the start of a pomodoro or a break'
          );
        }
      });
    }
  
    switchMode('pomodoro');
  });