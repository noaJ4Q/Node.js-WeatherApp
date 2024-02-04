const form = document.getElementById('weather-form');
const suggestionsContainer = document.querySelector('.weather-form-suggestion');
const suggestionsListContainer = document.querySelector('.weather-form-suggestion > .items');
const weatherLocationInput = document.querySelector('input[name="location"]');

weatherLocationInput.addEventListener('input', async (event) => {
    const weatherLocation = event.target.value;
    if (weatherLocation.length) {
        console.log(weatherLocation);
        hideSuggestions();
        const locationAlternatives = await fetchLocations(weatherLocation); // getting location options : array
        displaySuggestions(locationAlternatives);
    }
});

document.addEventListener('click', (event) => {
    const clickInsideInput = weatherLocationInput.contains(event.target);
    if (!clickInsideInput){
        hideSuggestions();
    }
})

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

function displaySuggestions(suggestions){
    suggestions.forEach(suggestion => {
        const listElement = document.createElement('li');
        listElement.textContent = suggestion.name;
        suggestionsListContainer.appendChild(listElement);
    });
    suggestionsContainer.classList.remove('hidden');
}

function hideSuggestions(){
    suggestionsContainer.classList.add('hidden');
    suggestionsListContainer.innerHTML = '';
}