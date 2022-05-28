import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './css/styles.css';
import { fetchCountries } from "./fetchCountries.js";

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

window.addEventListener('load', () =>
    refs.searchInput.addEventListener('input', debounce(inputSearching, DEBOUNCE_DELAY))
);

function inputSearching(e) {
    const searchValue = e.target.value.toLowerCase().trim();

    if (searchValue) {
        fetchCountries(searchValue)
        .then(displayResult)
        .catch(error => Notify.failure('Oops, there is no country with that name'));
    }
    clearContent();
}

function displayResult(arrCountries) {
    console.log(arrCountries, arrCountries.length);
    
    clearContent();

    if (arrCountries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }
    if (arrCountries.length === 1) {
        countryDetails(arrCountries[0]);
        return;
    }
    listMarkup(arrCountries);
}


function countryDetails(country) {
    refs.countryInfo.innerHTML =
        `<h2><img src=${country.flags.svg} alt="flag of ${country.name.official}" width="40"> ${country.name.official}</h2>
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${country.population}</p>
        <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>`
}

function listMarkup(arrCountries) {
    const markup = arrCountries.map(country => {
        const li = document.createElement('li');
        li.innerHTML = `<img src=${country.flags.svg} alt="flag of ${country.name.official}" width="20"></img> ${country.name.official}`;
        return li;
    });
    refs.countryList.append(...markup);
}

function clearContent() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}