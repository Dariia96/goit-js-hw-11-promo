import './css/styles.css';
import { fetchCountries } from './service/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


input.addEventListener('input', debounce (handlerSearch, DEBOUNCE_DELAY));


function handlerSearch(evt) {
    

    let countryName = input.value.trim();
    
    if (input.value) {
        fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');

            } else if (data.length <= 10 && data.length > 2) {
                countryInfo.hidden = true;
                countryList.hidden = false;
                countryList.innerHTML = createMarkupForFewCountry(data);

            } else {
                countryList.hidden = true;
                countryInfo.hidden = false;
                countryInfo.innerHTML = createMarkupForOneCountry(data)
            }
        })
            
            .catch(err =>  {
            if (err.status === `404`) {
                    Notiflix.Notify.failure('Oops, there is no country with that name');
                    clearcountryInfo()
                } Notiflix.Notify.failure(err);
                 console.error(err);
                 clearcountryInfo()
            })
            .finally();
        }
}

function clearcountryInfo() {
    
        countryInfo.innerHTML = ``;
        countryList.innerHTML = ``
    
}
function createMarkupForOneCountry(arr) {
    return arr.map(({ name, capital, population, flags, languages }) => `<li>
    <img src="${flags["svg"]}" width = 50>
    <h2>${name["official"]}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages).join(', ')}</p>
</li>`).join('')
}

function createMarkupForFewCountry(arr) {
    return arr.map(({ name,  flags }) => `<li>
    <img src="${flags["svg"]}" width = 50>
    <h2>${name["official"]}</h2>
</li>`).join('')
}

