let weatherLocation = document.querySelector('input[name="location"]');
weatherLocation.addEventListener('change', (event) => {
    console.log(event.target.value);
});