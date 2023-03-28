import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
  searchInput: document.querySelector('#search-box'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  let searchInput = e.target.value.trim();
  resetMarkup();
  if (searchInput === '') {
    return;
  }
  API.fetchCountries(searchInput).then(markup).catch(onFetchError);
}

function markup(country) {
  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (country.length <= 10 && country.length >= 2) {
    return renderCountryList(country);
  } else if (country.length === 1) {
    return renderCountryCard(country);
  }
}

function renderCountryCard(country) {
  const createdMarkup = country
    .map(({ name, population, capital, flags, languages }) => {
      return `<li><div class="wrapper-flag"><img src="${
        flags.svg
      }" alt="flags" width="100">   
          <h2 class="country-title">${name.official}</h2></div>
          <p>Population: ${population}</p>
          <p>Capital: ${capital}</p>
            <p>Language: ${Object.values(languages)}</p>
        </li>`;
    })
    .join('');

  refs.countryList.innerHTML = createdMarkup;
}

function renderCountryList(country) {
  const createdMarkup = country
    .map(({ name, flags }) => {
      return `<li>
          <div class="wrapper-flag"><img src="${flags.svg}" alt="flags" width="50">   
          <h2 class="country-title">${name.official}</h2>
        </li>`;
    })
    .join('');

  refs.countryList.innerHTML = createdMarkup;
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function resetMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
