const searchInputElement = document.querySelector("#search"),
	submitButtonElement = document.querySelector("#search-submit"),
	randomButtonElement = document.querySelector("#search-random"),
	mealResultsElement = document.querySelector("#meal-results"),
	selectedMealElement = document.querySelector("#selected-meal"),
	searchResultsHeading = document.querySelector("#search-results-heading");

let currentSearchTerm;

// Main API call depending on search performed
const fetchRecipe = async (search) => {
	console.log(search);
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/${search}`
		);
		const responseObject = await response.json();
		const meals = await responseObject.meals;

		if (meals === null) {
			searchResultsHeading.innerHTML = `<p class="search-results-heading">Sorry, no results found for '${currentSearchTerm}'</p>`;
		} else if (meals.length > 1) {
			await renderMealResults(meals, search);
		} else if (meals.length === 1) {
			await renderSelectedMeal(meals);
		}
		console.log(meals);
	} catch (err) {
		console.log(err);
	}
};

// Render HTML list of meals
const renderMealResults = (meals) => {
	searchResultsHeading.innerHTML = `<h2 class="search-results-heading__text">
                                        Search results for 
                                        <span class="search-results-heading__text--term">${currentSearchTerm}</span>
                                      </h2>`;
	mealResultsElement.innerHTML = meals
		.map((meal) => {
			return `<div class="recipe-card" data-mealID="${meal.idMeal}">
                        <div class="recipe-card__info" style="background-image: url('${meal.strMealThumb}');">
                            <div class="recipe-card__info-wrapper">
                                <span class="recipe-card__area">${meal.strArea} | </span>
                                <span class="recipe-card__category">${meal.strCategory}</span>
							</div>
							<div class="recipe-card__name">${meal.strMeal}</div>
                        </div>
                    </div>`;
		})
		.join("");
};

// Render single selected meal HTML
const renderSelectedMeal = () => {
	selectedMealElement.innerHTML = ``;
};

// Update state on input change
const handleInputChange = (event) => {};

// Trigger API call with search function
const handleSubmit = (event) => {
	event.preventDefault();

	currentSearchTerm = searchInputElement.value;
	searchInputElement.value = "";

	if (!currentSearchTerm.trim()) {
		searchResultsHeading.innerHTML = `<p class="results-heading--error">Hm, looks there are no recipes that use "nothing" as an ingredient. If you search for food you'll probably get better results!</p>`;
		return;
	}

	selectedMealElement.innerHTML = ``;
	fetchRecipe(`search.php?s=${currentSearchTerm}`);
};

// Trigger API call with random function
const handleRandom = (event) => {
	selectedMealElement.innerHTML = ``;

	fetchRecipe(`random.php`);
};

// Handle key presses for searching
const handleKeyPress = (event) => {
	if (event.key === "Enter" && event.currentTarget === searchInputElement) {
		console.log(event);
	}
};

window.addEventListener("keyup", handleKeyPress);
searchInputElement.addEventListener("input", handleInputChange);
submitButtonElement.addEventListener("click", handleSubmit);
randomButtonElement.addEventListener("click", handleRandom);
