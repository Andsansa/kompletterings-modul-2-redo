var API_URL = "https://api.openweathermap.org/data/2.5/weather";
var MAX_HISTORY = 5;
var KEY = "weatherSearchHistory";
$(function () {

    var popover = new bootstrap.Popover("#search-input", {
        trigger: "manual",
        title: "Location not found",
        content: "We couldn't find the city. Please try again!"
    });

    showHistory();

    function getWeather(params) {
        params.appid = API_KEY;
        params.units = "metric";
        params.lang = "sv";
        $.getJSON(API_URL, params).done(function (data) {
            popover.hide();
            $("#weather-icon").attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
            $("#weather-name").text(data.name + ", " + data.sys.country);
            $("#weather-temp").text(Math.round(data.main.temp) + " °C");
            $("#weather-wind").text("Wind: " + data.wind.speed + " m/s");
            $("#weather-result").removeClass("d-none");
            if (params.q) {
                var history = JSON.parse(localStorage.getItem(KEY) || "[]");
                var newHistory = [{
                    name: data.name,
                    temp: Math.round(data.main.temp),
                    wind: data.wind.speed,
                    icon: data.weather[0].icon
                }];
                for (var i = 0; i < history.length; i++) {
                    if (history[i].name.toLowerCase() !== data.name.toLowerCase()) {
                        newHistory.push(history[i]);
                    }
                }
                localStorage.setItem(KEY, JSON.stringify(newHistory.slice(0, 5)));
                showHistory();
            }
        }).fail(function () {
            $("#weather-result").addClass("d-none");
            popover.show();
        });
    }
    $("#search-input").keypress(function (e) {
        if (e.key === "Enter" && this.value.trim()) {
            getWeather({ q: this.value.trim() });
        }
    }).on("input", function () {
        popover.hide();
    });
    $("#btn-my-location").click(function () {
        navigator.geolocation.getCurrentPosition(function (pos) {
            getWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        }, function () {
            alert("Unable to retrieve your location. Please allow location access and try again.");
        });
    });
    
    $("#history-list").on("click", ".btn-close", function (e) {
        e.stopPropagation();
        var city = $(this).data("city");
        var history = JSON.parse(localStorage.getItem(KEY) || "[]");
        var newHistory = [];
        for (var i = 0; i < history.length; i++) {
            if (history[i].name !== city) {
                newHistory.push(history[i]);
            }
        }
        localStorage.setItem(KEY, JSON.stringify(newHistory));
        showHistory();
    });

    function showHistory() {
        var history = JSON.parse(localStorage.getItem(KEY) || "[]");

        if (!history.length) {
            $("#history-list").html('<li class="list-group-item text-muted">No searches yet</li>');
            return;
        }

        var html = "";
        for (var i = 0; i < history.length; i++) {
            var h = history[i];
            html += '<li class="list-group-item" data-city="' + h.name + '">' +
                '<img class="history-icon" src="https://openweathermap.org/img/wn/' + h.icon + '@2x.png">' +
                "<strong>" + h.name + "</strong> – " + h.temp + " °C, wind " + h.wind + " m/s" +
                '<button class="btn-close ms-auto" data-city="' + h.name + '"></button></li>';
        }
        $("#history-list").html(html);
    }
});
