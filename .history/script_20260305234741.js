const API_KEY = process.env.NASA_API_KEY;

const container = document.getElementById("current-image-container");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const historyList = document.getElementById("search-history");

function getCurrentImageOfTheDay() {
	const currentDate = new Date().toISOString().split("T")[0];

	fetch(
		`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`,
	)
		.then((res) => res.json())
		.then((data) => displayImage(data))
		.catch((err) => {
			container.innerHTML = "<p>Error loading image.</p>";
			console.error(err);
		});
}

function getImageOfTheDay(date) {
	fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
		.then((res) => res.json())
		.then((data) => {
			displayImage(data);

			saveSearch(date);
			addSearchToHistory();
		})
		.catch((err) => {
			container.innerHTML = "<p>Error fetching image.</p>";
			console.error(err);
		});
}

function displayImage(data) {
	container.innerHTML = `
    <h3>${data.title}</h3>
    <img src="${data.url}" alt="${data.title}">
    <p>${data.explanation}</p>
    <p><strong>Date:</strong> ${data.date}</p>
  `;
}

function saveSearch(date) {
	let searches = JSON.parse(localStorage.getItem("searches")) || [];

	if (!searches.includes(date)) {
		searches.push(date);
	}

	localStorage.setItem("searches", JSON.stringify(searches));
}

function addSearchToHistory() {
	historyList.innerHTML = "";

	const searches = JSON.parse(localStorage.getItem("searches")) || [];

	searches.forEach((date) => {
		const li = document.createElement("li");

		li.textContent = date;

		li.addEventListener("click", () => {
			getImageOfTheDay(date);
		});

		historyList.appendChild(li);
	});
}

form.addEventListener("submit", function (e) {
	e.preventDefault();

	const selectedDate = input.value;

	if (selectedDate) {
		getImageOfTheDay(selectedDate);
	}
});

window.addEventListener("load", () => {
	getCurrentImageOfTheDay();
	addSearchToHistory();
});
