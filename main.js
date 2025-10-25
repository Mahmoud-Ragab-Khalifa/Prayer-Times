// Selectors
let dateSelect = document.getElementById("date");
let citySelect = document.getElementById("city");
let cityName = document.querySelector(".city-name");
let dateInfo = document.querySelector(".date-info");
let fajr = document.querySelector(".fajr");
let sunrise = document.querySelector(".sunrise");
let dhuhr = document.querySelector(".dhuhr");
let asr = document.querySelector(".asr");
let maghrib = document.querySelector(".maghrib");
let isha = document.querySelector(".isha");

// Default Data
let date = new Date();
let validDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
console.log(validDate);
let city = citySelect.value;
let validCity = `${city[0].toUpperCase()}${city.slice(1)}`;
let country = "egypt";
let validCountry = `${country[0].toUpperCase()}${country.slice(1)}`;

// Function Create The Dayes Of Month
function fillDayes() {
  for (let i = 1; i <= 31; i++) {
    let option = document.createElement("option");
    let dat = new Date();
    let content = `${i >= 10 ? i : `0${i}`}-${dat.getMonth() + 1}-${dat.getFullYear()}`;
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

// Set Current City To App
function setCity(city) {
  let allCites = document.querySelectorAll("option");
  allCites.forEach((city) => {
    if (city.value === validCity) {
      cityName.innerHTML = city.innerHTML;
    }
  });
}

// Function Fill All Date Data
function fillDate(dayName, dayNumber, monthnumber, year) {
  const monthsInArabic = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  dateInfo.innerHTML = `${dayName} ${dayNumber} ${monthsInArabic[monthnumber - 1]} ${year}`;
}

// Get Timings Of Prayers And Set To App
function getData(apiLink) {
  fetch(apiLink)
    .then((response) => response.json())
    .then((response) => {
      fillDate(
        response.data.date.hijri.weekday.ar,
        response.data.date.gregorian.day,
        response.data.date.gregorian.month.number,
        response.data.date.gregorian.year
      );
      let time = response.data.timings;
      fajr.innerHTML = handleTime(time.Fajr);
      sunrise.innerHTML = handleTime(time.Sunrise);
      dhuhr.innerHTML = handleTime(time.Dhuhr);
      asr.innerHTML = handleTime(time.Asr);
      maghrib.innerHTML = handleTime(time.Maghrib);
      isha.innerHTML = handleTime(time.Isha);
    });
}

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
  let allDateOtions = document.querySelectorAll("#date option");
  allDateOtions.forEach((option) => {
    if (option.value === validDate) {
      dateSelect.value = validDate;
      option.selected = true;
      option.setAttribute("selected", "");
    }
  });
  getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);
});

// Handle The Change Of City
citySelect.addEventListener("change", function () {
  validCity = citySelect.value;
  setCity(validCity);
  window.localStorage.setItem("city", citySelect.value);
  getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);
});

// Handle Local Storage Data
window.onload = function () {
  getTodayDate();
  if (window.localStorage.getItem("city")) {
    validCity = window.localStorage.getItem("city");
    citySelect.value = validCity;
    setCity(validCity);
    getData(`https://api.aladhan.com/v1/timingsByCity/${validDate}?city=${validCity}&country=${validCountry}&method=5`);
  }
};

// =============================================================
// Future Enhancement Is
// -- Activate The Country Selection
// -- And So On Change The Cities List Based On Selected Country
// -- Idea For Adding Alazan Voice Or Any Regional Voice In Background Of App
// -- Set Control Buttons To Control This Voice
// =============================================================
