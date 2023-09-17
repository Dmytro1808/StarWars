import constants from './constants.js';

const API = constants.API
let nextUrlPrevVehicles = '';
let nextUrlNextVehicles = `${API}/vehicles/`;
let isLoading = false;

function showLoading() {
    // Получаем контейнер лоадинга и устанавливаем его видимость
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer.style.display = 'flex';
  }
  
  function hideLoading() {
    // Скрываем контейнер лоадинга
    const loaderContainer = document.querySelector('.loader-container');
    loaderContainer.style.display = 'none';
  }

    function LoadVehiclesList(url) {
        isLoading = true;
        showLoading(); // Показываем лоадинг перед загрузкой данных
      
        document.querySelector('#RightVehicles').setAttribute('disabled', 'disabled');
        document.querySelector('#LeftVehicles').setAttribute('disabled', 'disabled');

    isLoading = true;

    document.querySelector('#RightVehicles').setAttribute('disabled', 'disabled');
    document.querySelector('#LeftVehicles').setAttribute('disabled', 'disabled');

    axios
        .get(url)
        .then((res) => {
            const VehiclesList = document.querySelector('#VehiclesList');
            VehiclesList.innerHTML = '';

            res.data.results.forEach((vehicles) => {
                const li = document.createElement('li');
                li.textContent = vehicles.name;
                li.classList.add('mb-3');
                li.classList.add('list-none');
                VehiclesList.appendChild(li);
            });

            nextUrlNextVehicles = res.data.next;
            nextUrlPrevVehicles = res.data.previous;

            const TitleVehicles = document.querySelector('#TitleVehicles');
            const NavVehicles = document.querySelector('#NavVehicles');
            TitleVehicles.style.display = 'block';
            NavVehicles.style.display = 'flex';
            NavVehicles.classList.add('justify-center');
        })
        //ошибка
        .catch((error) => {
            document.querySelector('#TitleVehicles').style.display = 'none';
            document.querySelector('#NavVehicles').style.display = 'none';
            document.querySelector('#VehiclesList').innerHTML = '';

            const errorModal = document.querySelector('#errorModal');
            errorModal.style.display = 'block';

            const closeBtn = document.querySelector('#close');

            closeBtn.addEventListener('click', () => {

                errorModal.style.display = 'none';

                window.location.href = 'index.html';
                hideLoading();
            });
        })
        .finally(() => {
            isLoading = false;
            hideLoading(); 
            document.querySelector('#RightVehicles').removeAttribute('disabled');
            document.querySelector('#LeftVehicles').removeAttribute('disabled');
          });
      }

//nextUrlPrev
document.querySelector('#LeftVehicles').addEventListener('click', async function() {
    if (!isLoading && nextUrlPrevVehicles) {
        const hoverElement = document.querySelector('#HoverLeftVehicles');
            hoverElement.classList.add('hover:bg-red-600');
    }
        try {
            // Показать загрузку до завершения загрузки данных
            showLoading();
            await LoadVehiclesList(nextUrlPrevVehicles);
        } catch (error) {
            // Обработка ошибок при загрузке данных
            console.error(error);
        }
    });

//nextUrlNext
document.querySelector('#RightVehicles').addEventListener('click', async function() {
    if (!isLoading && nextUrlNextVehicles) {
        const hoverElement = document.querySelector('#HoverLeftVehicles');
            hoverElement.classList.add('hover:bg-red-600');
    }
        try {
            // Показать загрузку до завершения загрузки данных
            showLoading();
            await LoadVehiclesList(nextUrlNextVehicles);
        } catch (error) {
            // Обработка ошибок при загрузке данных
            console.error(error);
        }
    });


document.querySelector('#GetVehicles').addEventListener('click', function() {
    const content = document.querySelector('#content');
    content.style.display = 'none';

    LoadVehiclesList(nextUrlNextVehicles);
});

document.querySelector('#VehiclesList').addEventListener('click', function(event) {
    const clickedvehicles = event.target.textContent;
    if (clickedvehicles) {
        GetVehiclesDetails(clickedvehicles);
    }
});

function GetVehiclesDetails(vehiclesName) {
    // Показать лоадинг перед загрузкой данных
    showLoading();
    
    axios
        .get(`${API}/vehicles/?search=${vehiclesName}`)
        .then((res) => {
            const vehicles = res.data.results[0];
            if (vehicles) {
                const name = vehicles.name !== 'unknown' ? `Имя: ${vehicles.name}` : 'Имя: Неизвестно';
                const passengers = vehicles.passengers !== 'unknown' ? `Кол-во пассажиров: ${vehicles.passengers}` : 'Кол-во: Неизвестно';
                const length = vehicles.length !== 'unknown' ? `Длина: ${vehicles.length} м. ` : 'Длина: Неизвестно';
                const model = vehicles.model !== 'unknown' ? `Модель: ${vehicles.model}` : 'Модель: Неизвестно';
                const crew = vehicles.crew !== 'unknown' ? `Экипаж: ${vehicles.crew} чел.` : 'Экипаж: Неизвестно';

                const VehiclesDetailsList = document.querySelector('#VehiclesDetailsList');
                VehiclesDetailsList.innerHTML =
                    `<li>${name}</li>
                    <li>${passengers}</li>
                    <li>${model}</li>
                    <li>${crew}</li>
                    <li>${length}</li>`;

                const VehiclesDetailsModal = document.querySelector('#VehiclesDetailsModal');
                VehiclesDetailsModal.style.display = 'block';

                const vehiclesHeroDetails = document.querySelector('#CloseVehiclesDetails');
                vehiclesHeroDetails.addEventListener('click', () => {
                    VehiclesDetailsModal.style.display = 'none';
                });
            }
        })
        .catch((error) => {
            // Обработка ошибок при загрузке данных (по желанию)
            console.error(error);
        })
        .finally(() => {
            // Скрыть лоадинг после завершения запроса, независимо от результата
            hideLoading();
        });
}

