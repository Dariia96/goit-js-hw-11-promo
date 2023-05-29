import Notiflix from 'notiflix';
function fetchCountries(country) {

const BASE_URL = "https://restcountries.com/v3.1/name";

        return fetch(`${BASE_URL}/${country}`)
            .then(resp => {
                console.log(resp);
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                } 
                return resp.json() 
            })
            
    
}

export { fetchCountries }

