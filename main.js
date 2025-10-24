// Selectors
let dateSelect = document.getElementById("date");
let citySelect = document.getElementById("city");
let fajr = document.querySelector(".fajr");
let sunrise = document.querySelector(".sunrise");
let dhuhr = document.querySelector(".dhuhr");
let asr = document.querySelector(".asr");
let maghrib = document.querySelector(".maghrib");
let isha = document.querySelector(".isha");

// Handle Local Storage Data
window.onload = function () {
  if (window.localStorage.getItem("city")) {
    validCity = window.localStorage.getItem("city");
    citySelect.value = validCity;
    getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);
  }
};

// Default Data
let date = new Date();
date = date.toLocaleString();
let validDate = `${date.slice(3, 5)}-${date.slice(0, 2)}-${date.slice(6, 10)}`;
let city = citySelect.value;
let validCity = `${city[0].toUpperCase()}${city.slice(1)}`;
let country = "egypt";
let validCountry = `${country[0].toUpperCase()}${country.slice(1)}`;

// Function Create The Dayes Of Month
function fillDayes() {
  for (let i = 1; i <= 31; i++) {
    let option = document.createElement("option");
    let date = new Date();
    let content = `${i >= 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`;
    option.value = content;
    option.innerHTML = content;
    dateSelect.appendChild(option);
  }
}

fillDayes();

// Set Current Date To App
function getTodayDate() {
  dateSelect.value = validDate;
}

getTodayDate();

// Get Timings Of Prayers And Set To App
function getData(apiLink) {
  fetch(apiLink)
    .then((response) => response.json())
    .then((response) => {
      let time = response.data.timings;
      fajr.innerHTML = handleTime(time.Fajr);
      sunrise.innerHTML = handleTime(time.Sunrise);
      dhuhr.innerHTML = handleTime(time.Dhuhr);
      asr.innerHTML = handleTime(time.Asr);
      maghrib.innerHTML = handleTime(time.Maghrib);
      isha.innerHTML = handleTime(time.Isha);
    });
}

getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);

// Handle The Time In 4 Digts and 12 Hours Mode
function handleTime(apiTime) {
  let hour = apiTime.slice(0, 2);
  +hour > 12 ? (hour = +hour - 12 > 10 ? +hour - 12 : `0${+hour - 12}`) : (hour = hour);
  let minutes = apiTime.slice(3);
  return `${hour}:${minutes}`;
}

// Handle The Change Of Date
dateSelect.addEventListener("change", function () {
  validDate = dateSelect.value;
  getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);
});

// Handle The Change Of City
citySelect.addEventListener("change", function () {
  validCity = citySelect.value;
  window.localStorage.setItem("city", citySelect.value);
  getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);
});

// =============================================================
// Future Enhancement Is
// -- Activate The Country Selection
// -- And So On Change The Cities List Based On Selected Country
// -- Idea For Adding Alazan Vice Or Any Regional Voice In Background Of App
// -- Set Control Buttons To Control This Voice
// =============================================================
