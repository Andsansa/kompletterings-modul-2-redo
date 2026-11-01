var API_URL = "https://api.openweathermap.org/data/2.5/weather";
var MAX_HISTORY = 5;
var KEY = "weatherSearchHistory";
$(function () {

    var popover = new bootstrap.Popover("#search-input", {
        trigger: "manual",
        title: "Location not found",
        content: "We couldn't find the city. Please try again!"
    });

});
