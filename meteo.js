// Gestion de la date
let date = new Date();
let dateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "numeric"
};

document.querySelector(".date").textContent = date.toLocaleDateString("fr", dateOptions);

// Déclaration des variables
let town, zipCode;
let byName = document.querySelector("#byName");
var options = {
    enableHighAccuracy: true
}

// Disparition de l'alerte lorsque l'utilisateur clique à nouveau sur le bouton "changer de ville" 
$("button[data-toggle=modal]").on("click", function() {
    $(".alert").hide();
})

// Code executé si géolocalisation autorisée par l'utilisateur / ou sinon
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const URL = "https://api.openweathermap.org/data/2.5/weather?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude + "&appid=119b1d107ca09aec999d0ff5a7fb8ac7&units=metric&lang=fr";
        getMeteo(URL);
    }, error, options);
} else {
    error();
}

// Code executé si la géolocalisation est refusée par l'utilisateur ou si une erreur interne survient
function error() {
    const URL = "https://api.openweathermap.org/data/2.5/weather?q=paris&appid=119b1d107ca09aec999d0ff5a7fb8ac7&units=metric&lang=fr";
    getMeteo(URL);
}

// Gestion du formulaire
let form = document.querySelector('form');
form.addEventListener("submit", function(event) {
    event.preventDefault();

    if ($("#cityName").val() != "") {

        town = $("#cityName").val();
        const URL = "https://api.openweathermap.org/data/2.5/weather?q=" + town + "&appid=119b1d107ca09aec999d0ff5a7fb8ac7&units=metric&lang=fr";
        getMeteo(URL);

    } else if ($("#zipCode").val() != "") {

        zipCode = $("#zipCode").val();
        const URL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",fr&appid=119b1d107ca09aec999d0ff5a7fb8ac7&units=metric&lang=fr";
        getMeteo(URL);

    } else if (($("#longitude").val() != "") && ($("#latitude").val() != "")) {

        longitude = $("#longitude").val();
        latitude = $("#latitude").val();
        const URL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=119b1d107ca09aec999d0ff5a7fb8ac7&units=metric&lang=fr";
        console.log(URL);
        getMeteo(URL);
    } else {
        error();
    }

    $("#changeModal").modal('hide');
})

function getMeteo(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = 'json';
    request.send();
    
    request.onload = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                let response = request.response;
                let weatherId = response.weather[0].id;

                document.getElementById("temperature_label").textContent = response.main.temp;
                document.getElementById("ville").textContent = response.name;
                document.getElementById("description").textContent = response.weather[0].description;
                document.getElementById("wind").textContent = response.wind.speed;
                document.getElementById("humidity").textContent = response.main.humidity;

                if (weatherId >= 200 && weatherId <= 232) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-thunderstorms-fill'></i>";
                } else if (weatherId >= 300 && weatherId <= 321) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-drizzle-fill'></i>";
                } else if (weatherId >= 500 && weatherId <= 531) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-heavy-showers-line'></i>";
                } else if (weatherId >= 600 && weatherId <= 622) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-snowy-line'></i>";
                } else if (weatherId >= 701 && weatherId <= 762) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-mist-fill'></i>";
                } else if (weatherId >= 771 && weatherId <= 781) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-tornado-fill'></i>";
                } else if (weatherId == 800) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-sun-fill'></i>";
                } else if (weatherId == 801) {
                    document.querySelector("#icone").innerHTML = "<i class='ri-sun-cloudy-line'></i>";
                } else {
                    document.querySelector("#icone").innerHTML = "<i class='ri-cloudy-fill'></i>";
                }
             
            } else {
                document.querySelector(".alert").style.display = "block";
            }
            $(".form-control").val("");
        }
    }
}

// Toggle des boutons pour choisir la méthode de sélection
$("#byName").on("click", function() {
    $("button[type=submit]").show();
    $(".nameInput").show();
    $("#cityName").focus();
    $(".zipInput").hide();
    $(".coordInput").hide();
});
$("#byZip").on("click", function() {
    $("button[type=submit]").show();
    $(".nameInput").hide();
    $(".zipInput").show();
    $("#zipCode").focus();
    $(".coordInput").hide();
});
$("#byCoord").on("click", function() {
    $("button[type=submit]").show();
    $(".nameInput").hide();
    $(".zipInput").hide();
    $(".coordInput").show();
    $("#longitude").focus();
});