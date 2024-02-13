const form = document.getElementById('weather-form');
const searchWrapper = document.querySelector('.weather-form-wrap')
const resultsWrapper = document.querySelector('.weather-form-suggestions');
const locationInput = document.querySelector('input[name="location"]');

let searchTimer;
locationInput.addEventListener('input', async (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {

        let apiResults = []
        const weatherLocation = event.target.value;
        if (weatherLocation.length) {
            apiResults = await fetchLocations(weatherLocation); // getting location options : array
        } else {
            apiResults = [];
        }
        renderResults(apiResults);
        enableSelectSuggestions();

    }, 1000);
});

// document.addEventListener('click', (event) => {
//     const clickInsideInput = locationInput.contains(event.target);
//     if (!clickInsideInput){
//         renderResults([]);
//     }
// })

function enableSelectSuggestions(){
    const suggestionsHTML = document.querySelector('.weather-form-suggestions > .items > li');
    const suggestions = [suggestionsHTML];
    suggestions.forEach(element => {
        element.addEventListener('click', () => {
            const lat = element.getAttribute('data-lat');
            const lon = element.getAttribute('data-lon');
            
            const latitudeInput = document.querySelector('input[name="lat"]');
            const longitudeInput = document.querySelector('input[name="lon"]');

            latitudeInput.value = lat;
            longitudeInput.value = lon;

            form.submit();
        })
    });
}

function renderResults(results){
    if (!results.length){
        return searchWrapper.classList.remove('show-suggestions');
    }
    const content = results.map((item) => {
        return `<li data-lat="${item.lat}" data-lon="${item.lon}">${item.name}</li>`;
    }).join('');
    searchWrapper.classList.add('show-suggestions');
    resultsWrapper.innerHTML = `<ul class="items card">${content}</ul>`;
}

async function fetchLocations(weatherLocation){
    const baseURL = window.location.origin;
    const url = `${baseURL}/search?weatherLocation=${weatherLocation}`;
    const config = {
        headers: {
            'Content-Type': 'application/json' 
        }
    }
    const response = await fetch(url, config);
    return response.json();
}