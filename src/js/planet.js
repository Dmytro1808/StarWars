import constants from './constants.js';

const API = constants.API
let nextUrlPrevPlanet = '';
let nextUrlNextPlanet = `${API}/planets/`;
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

function LoadPlanetList(url) {

    isLoading = true;
    showLoading();

    document.querySelector('#RightPlanet').setAttribute('disabled', 'disabled');
    document.querySelector('#LeftPlanet').setAttribute('disabled', 'disabled');

    axios
        .get(url)
        .then((res) => {
            const PlanetList = document.querySelector('#PlanetList');
            PlanetList.innerHTML = '';

            res.data.results.forEach((planets) => {
                const li = document.createElement('li');
                li.textContent = planets.name;
                li.classList.add('mb-3');
                li.classList.add('list-none');
                PlanetList.appendChild(li);
            });

            nextUrlNextPlanet = res.data.next;
            nextUrlPrevPlanet = res.data.previous;

            const TitlePlanet = document.querySelector('#TitlePlanet');
            const NavPlanet = document.querySelector('#NavPlanet');
            TitlePlanet.style.display = 'block';
            NavPlanet.style.display = 'flex';
            NavPlanet.classList.add('justify-center');
        })
        //ошибка
        .catch((error) => {
            document.querySelector('#TitlePlanet').style.display = 'none';
            document.querySelector('#NavPlanet').style.display = 'none';
            document.querySelector('#PlanetList').innerHTML = '';

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
            document.querySelector('#RightPlanet').removeAttribute('disabled');
            document.querySelector('#LeftPlanet').removeAttribute('disabled');
        });
}

//nextUrlPrev
document.querySelector('#HoverLeftPlanet').addEventListener('click', async function() {
    if (!isLoading && nextUrlPrevPlanet) {
        const hoverElement = document.querySelector('#HoverLeftPlanet');
            hoverElement.classList.add('hover:bg-red-600');
    }
        try {
            // Показать загрузку до завершения загрузки данных
            showLoading();
            await LoadPlanetList(nextUrlPrevPlanet);
        } catch (error) {
            // Обработка ошибок при загрузке данных
            console.error(error);
        }
    });

//nextUrlNext
document.querySelector('#HoverRightPlanet').addEventListener('click', async function() {
    if (!isLoading && nextUrlNextPlanet) {
        const hoverElement = document.querySelector('#HoverRightPlanet');
            hoverElement.classList.add('hover:bg-red-600');
    }
        try {
            // Показать загрузку до завершения загрузки данных
            showLoading();
            await LoadPlanetList(nextUrlNextPlanet);
        } catch (error) {
            // Обработка ошибок при загрузке данных
            console.error(error);
        }
    });

document.querySelector('#GetPlanet').addEventListener('click', function() {
    const content = document.querySelector('#content');
    content.style.display = 'none';

    LoadPlanetList(nextUrlNextPlanet);
});

document.querySelector('#PlanetList').addEventListener('click', function(event) {
    const clickedPlanet = event.target.textContent;
    if (clickedPlanet) {
        GetPlanetDetails(clickedPlanet);
    }
});

function GetPlanetDetails(planetsName) {
    showLoading();
    axios
        .get(`${API}/planets/?search=${planetsName}`)
        .then((res) => {
            const planets = res.data.results[0];
            if (planets) {
                const name = planets.name !== 'unknown' ? `Имя: ${planets.name}` : 'Имя: Неизвестно';
                const gravity = planets.gravity !== 'unknown' ? `Уровень гравитации: ${planets.gravity}` : 'Уровень гравитации: Неизвестно';
                const population = planets.population !== 'unknown' ? `Население: ${planets.population} чел. ` : 'Население: Неизвестно';
                const orbital_period = planets.orbital_period !== 'unknown' ? `Орбитальный период: ${planets.orbital_period} дня` : 'Орбитальный период: Неизвестно';
                const diameter = planets.diameter !== 'unknown' ? `Диаметр: ${planets.diameter} км.` : 'Диаметр: Неизвестно';

                const PlanetDetailsList = document.querySelector('#PlanetDetailsList');
                PlanetDetailsList.innerHTML =
                    `<li>${name}</li>
                        <li>${gravity}</li>
                        <li>${population}</li>
                        <li>${orbital_period}</li>
                        <li>${diameter}</li>`;

                const PlanetDetailsModal = document.querySelector('#PlanetDetailsModal');
                PlanetDetailsModal.style.display = 'block';

                const ClosePlaneteDetails = document.querySelector('#ClosePlaneteDetails');
                ClosePlaneteDetails.addEventListener('click', () => {
                    PlanetDetailsModal.style.display = 'none';
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

