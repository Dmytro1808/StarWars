import constants from './constants.js';

const API = constants.API
let nextUrlPrev = '';
let nextUrlNext = `${API}/people/`;
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

function loadHeroList(url) {

    isLoading = true;
    showLoading();

    document.querySelector('#right').setAttribute('disabled', 'disabled');
    document.querySelector('#left').setAttribute('disabled', 'disabled');

    axios
        .get(url)
        .then((res) => {
            const heroList = document.querySelector('#heroList');
            heroList.innerHTML = '';

            res.data.results.forEach((hero) => {
                const li = document.createElement('li');
                li.textContent = hero.name;
                li.classList.add('mb-3');
                li.classList.add('list-none');
                heroList.appendChild(li);
            });

            nextUrlNext = res.data.next;
            nextUrlPrev = res.data.previous;

            const h2 = document.querySelector('#h2');
            const nav = document.querySelector('#nav');
            h2.style.display = 'block';
            nav.style.display = 'flex';
            nav.classList.add('justify-center');
        })
        //ошибка
        .catch((error) => {
            document.querySelector('#h2').style.display = 'none';
            document.querySelector('#nav').style.display = 'none';
            document.querySelector('#heroList').innerHTML = '';

            const errorModal = document.querySelector('#errorModal');
            errorModal.style.display = 'block';

            const closeBtn = document.querySelector('#close');

            closeBtn.addEventListener('click', () => {

                errorModal.style.display = 'none';

                window.location.href = 'index.html';
            });
        })
        .finally(() => {
            isLoading = false;
            hideLoading();
            document.querySelector('#right').removeAttribute('disabled');
            document.querySelector('#left').removeAttribute('disabled');
        });
}

//nextUrlPrev
document.querySelector('#HoverLeft').addEventListener('click', async function() {
    if (!isLoading && nextUrlPrev) {
        const hoverElement = document.querySelector('#HoverLeft');
            hoverElement.classList.add('hover:bg-red-600');
    }
        try {
            // Показать загрузку до завершения загрузки данных
            showLoading();
            await loadHeroList(nextUrlPrev);
        } catch (error) {
            // Обработка ошибок при загрузке данных
            console.error(error);
        }
    });

//nextUrlNext
document.querySelector('#HoverRight').addEventListener('click', async function() {
    if (!isLoading && nextUrlNext) {
        const hoverElement = document.querySelector('#HoverRight');
            hoverElement.classList.add('hover:bg-red-600');
    }
        try {
            // Показать загрузку до завершения загрузки данных
            showLoading();
            await loadHeroList(nextUrlNext);
        } catch (error) {
            // Обработка ошибок при загрузке данных
            console.error(error);
        }
    });

document.querySelector('#get').addEventListener('click', function() {
    const content = document.querySelector('#content');
    content.style.display = 'none';

    loadHeroList(nextUrlNext);
});

document.querySelector('#heroList').addEventListener('click', function(event) {
    const clickedHero = event.target.textContent;
    if (clickedHero) {
        getHeroDetails(clickedHero);
    }
});

function getHeroDetails(heroName) {
    showLoading();
    axios
        .get(`${API}/people/?search=${heroName}`)
        .then((res) => {
            const hero = res.data.results[0];
            if (hero) {
                const name = hero.name !== 'unknown' ? `Имя: ${hero.name}` : 'Имя: Неизвестно';
                const height = hero.height !== 'unknown' ? `Рост: ${hero.height} см` : 'Рост: Неизвестно';
                const gender = hero.gender !== 'unknown' ? `Гендер: ${hero.gender}` : 'Гендер: Неизвестно';
                const hair_color = hero.hair_color !== 'unknown' ? `Цвет волос: ${hero.hair_color}` : 'Цвет волос: Неизвестно';
                const skin_color = hero.skin_color !== 'unknown' ? `Цвет скина: ${hero.skin_color}` : 'Цвет скина: Неизвестно';

                const heroDetailsList = document.querySelector('#heroDetailsList');
                heroDetailsList.innerHTML =
                    `<li>${name}</li>
                        <li>${gender}</li>
                        <li>${hair_color}</li>
                        <li>${height}</li>
                        <li>${skin_color}</li>`;

                const heroDetailsModal = document.querySelector('#heroDetailsModal');
                heroDetailsModal.style.display = 'block';

                const closeHeroDetails = document.querySelector('#closeHeroDetails');
                closeHeroDetails.addEventListener('click', () => {
                    heroDetailsModal.style.display = 'none';
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

