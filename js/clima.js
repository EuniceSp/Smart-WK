/** Seleccionamos los elementos del html */

const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');
/**Añadimos un evento al formulario, de cuando se de submit
 * se produzca el evento con condicional de que si no están ingresados
 * los valores que se piden, te muestre un error, sin embargo
 * si si estan seleccionados va a llamar a la API de clima
 * pasando el valor ingresado dentro de nuestro formulario
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCity.value === '' || nameCountry.value === '') {
        showError('Ambos campos son obligatorios...');
        return;
    }

    callAPI(nameCity.value, nameCountry.value);
    //console.log(nameCity.value);
    //console.log(nameCountry.value);
})

/**Función para llamar la API, vamos a usar la API openweathermap, previamente
 * ya estamos registrados, y nos dieron un ID para poder hacer uso de la misma
 * se piden los valores de ciudad y país.
 */

function callAPI(city, country){
    const apiId = '41d1d7f5c2475b3a16167b30bc4f265c';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

    /**Hacemos uso de la API con un fetch, donde la información
     * se pase en json cuando se tengan los valores y se comparen, 
     * si no se encuentra dentro del json los valores ingresados nos va 
     * a arrojar el error. Después, se limpia el html y se muestra el clima
     * con la información recabada en el json. Aplicamos un catch para los errores
     */

    fetch(url)
        .then(data => {
            return data.json();
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                showError('Ciudad no encontrada...');
            } else {
                clearHTML();
                showWeather(dataJSON);
            }
            //console.log(dataJSON);
        })
        .catch(error => {
            console.log(error);
        })
}

/** Creamos la función de mostrar Clima, con los datos previamente recolectados
 * definimos constantes de los elementos que queremos tener
 */

function showWeather(data){
    const {name, main:{temp, temp_min, temp_max}, weather:[arr]} = data;

    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);
    /**Creamos el elemento div para poder mostrar el clima e ingresamos los datos
     * ya cargados de la api del clima
     */
    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;

    /**Lo insertamos al contenido */

    result.appendChild(content);

    /* console.log(name);
    console.log(temp);
    console.log(temp_max);
    console.log(temp_min);
    console.log(arr.icon); */
}

/**Tenemos función para si hay un error nos lo arroje */

function showError(message){
    //console.log(message);
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

/**Tenemos una función para cambiar los datos que son en kelvin
 * en la api a centigrados
 */

function kelvinToCentigrade(temp){
    return parseInt(temp - 273.15);
}

/**Se limpia el html */

function clearHTML(){
    result.innerHTML = '';
}