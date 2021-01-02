const searchInputElement = document.querySelector("#search"),
	submitButtonElement = document.querySelector("#search-submit"),
	randomButtonElement = document.querySelector("#search-random"),
	mealResultsElement = document.querySelector("#meal-results"),
	selectedMealElement = document.querySelector("#selected-meal"),
	searchResultsHeading = document.querySelector("#search-results-heading");

// Manage state variables
let currentSearchTerm;
let mealResults;
let selectedMealIsOpen = false;

// Main API call depending on search performed
const fetchRecipe = async (search) => {
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/${search}`
		);
		const responseObject = await response.json();
		const meals = await responseObject.meals;
		mealResults = await meals;

		if (meals === null) {
			searchResultsHeading.innerHTML = `<p class="search-results-heading">Sorry, no results found for '${currentSearchTerm}'</p>`;
		} else if (search === "random.php") {
			await renderSelectedMeal(meals[0]);
		} else if (meals.length >= 1) {
			await renderMealResults(meals);
		}
	} catch (err) {
		console.log(err);
	}
};

// Render HTML list of meals
const renderMealResults = (meals) => {
	// Change search results heading to include query
	searchResultsHeading.innerHTML = `<h2 class="search-results-heading__text">
			Search results for 
			<span class="search-results-heading__text--term">${currentSearchTerm.toLowerCase()}</span>
		</h2>`;
	mealResultsElement.innerHTML = meals
		.map((meal) => {
			return `<div class="recipe-card" data-mealID="${meal.idMeal}">
                        <div class="recipe-card__info" style="background-image: url('${meal.strMealThumb}');">
                            <div class="recipe-card__info-wrapper">
                                <span class="recipe-card__area">${meal.strArea}</span>
                                <span class="recipe-card__category">${meal.strCategory}</span>
							</div>
							<div class="recipe-card__name">${meal.strMeal}</div>
                        </div>
                    </div>`;
		})
		.join("");
};

/* Search the list of meals stored in state to find the one with the matching ID */
const getMealByID = (id) => {
	const selectedMeal = mealResults.find((item) => item.idMeal === id);
	return selectedMeal;
};

const openSelectedMeal = () => {
	selectedMealElement.classList.remove("closed", "fade-out");
	selectedMealElement.classList.add("open", "fade-in");

	/* Set timeout to make sure state isn't instantly set to true,
		as window click event listener will immediately fire the close method
		if it detects a click when selectedMealIsOpen is true
	*/

	window.scrollTo({ top: 80, behavior: "smooth" });
	setTimeout(() => {
		selectedMealIsOpen = true;
	}, 1);
};

const handleSelectedMealClose = () => {
	selectedMealElement.classList.remove("open", "fade-in");
	selectedMealElement.classList.add("fade-out");

	selectedMealElement.onanimationend = () => {
		!selectedMealIsOpen ? selectedMealElement.classList.add("closed") : null;
	};

	selectedMealIsOpen = false;
};

const processMealIngredients = (meal) => {
	/* Meal object contains ingredients and measures in this structure:
		{
			strIngredient1: "flour",
			strIngredient2: "butter",
			strMeasure1: "2 cups",
			strMeasure2: "1 stick",
		}

		So we have to iterate over it, find every strIngredient{num} and its corresponing measure,
		adding it to a new array of ingredients and corresponding measures.
	*/

	const ingredients = [];

	for (let i = 1; i <= 20; i++) {
		let currentIngredient = meal[`strIngredient${i}`];
		let currentMeasure = meal[`strMeasure${i}`];
		if (currentIngredient) {
			ingredient = {
				id: i,
				ingredient: currentIngredient,
				measure: currentMeasure,
			};
			ingredients.push(ingredient);
		}
	}
	return ingredients;
};

const generateIngredientList = (ingredients) => {
	const ingredientList = ingredients
		.map((item) => {
			return `
			<li class="ingredient-list__item"><span class="ingredient-list__ingredient">${
				item.ingredient
			}</span>${
				item.measure
					? `<span class="ingredient-list__measure">${item.measure}</span>`
					: ""
			}</li>
		`;
		})
		.join("");
	return ingredientList;
};

const processInstructions = (instructions) => {
	const instructionsHTML = instructions
		.split("\r\n")
		.map((line) => {
			return `<p>${line}</p>`;
		})
		.join("");

	return instructionsHTML;
};

// Render single selected meal HTML
const renderSelectedMeal = (meal) => {
	// Open meal modal
	openSelectedMeal();

	//Destructure meal object
	const {
		strMeal,
		strCategory,
		strArea,
		strInstructions,
		strMealThumb,
		strTags,
		strYoutube,
		strSource,
	} = meal;

	// Split the weird ingredient/measure format into readable object array
	const ingredients = processMealIngredients(meal);
	// Generate HTML for list of ingredients to add in later
	const ingredientList = generateIngredientList(ingredients);
	// Turn instructions into HTML with paragraph breaks
	const instructions = processInstructions(strInstructions);

	// Set the main content for the meal recipe modal
	selectedMealElement.innerHTML = `

	
	<div class="selected-meal__info">
		<button class="selected-meal--close-button" id="selected-meal-close-button">X</button>
		<div class="selected-meal__title-container">
			<h2>${meal.strMeal}</h2>
			<a href="${strYoutube}" class="selected-meal__youtube"><i class="fab fa-youtube"></i></a>
		</div>		 
	</div>
	<div class="selected-meal__body">
		<div class="selected-meal__top">
			<span class="switch-arrow" id="switch-arrow-back">
				<i class="fas fa-chevron-left"></i>
			</span>
			<div class="selected-meal__ingredients">
				<h3 class="selected-meal__ingredients-title">Ingredients</h3>
				<ul class="selected-meal__ingredient-list">
					${ingredientList}
				</ul>
			</div>
			<div class="selected-meal__image-container">
				<img src=${strMealThumb} alt=${strMeal} class="selected-meal__image"/>
				<div class="selected-meal__description-container">
					<div class="selected-meal__area recipe-card__area">${strArea}</div>
					<div class="selected-meal__category recipe-card__category">${strCategory}</div>				
				</div>
			</div>
			<span class="switch-arrow" id="switch-arrow-forward">
				<i class="fas fa-chevron-right"></i>
			</span>
		</div>
		<div class="selected-meal__instructions">
			<p>${instructions}</p>
		</div>
	</div>
	`;
};

const switchMeal = (key) => {
	console.log(key);
	const mealIndex = mealResults.findIndex(
		(item) => item.idMeal === selectedMeal.idMeal
	);

	const renderNextMeal = (index) => {
		const nextMeal = mealResults[index];
		selectedMeal = nextMeal;
		renderSelectedMeal(nextMeal);
	};

	if (key === "ArrowRight" || key === "forward") {
		if (mealIndex < mealResults.length - 1) {
			renderNextMeal(mealIndex + 1);
		} else if (mealIndex === mealResults.length - 1) {
			renderNextMeal(0);
		}
	} else if (key === "ArrowLeft" || key === "back") {
		if (mealIndex > 0) {
			renderNextMeal(mealIndex - 1);
		} else if (mealIndex === 0) {
			renderNextMeal(mealResults.length - 1);
		}
	}
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
	fetchRecipe(`random.php`);
};

// Handle key presses for searching
const handleKeyPress = (event) => {
	if (selectedMealIsOpen) {
		event.preventDefault();
		if (event.key === "Escape") {
			handleSelectedMealClose();
		} else if (event.key === "ArrowRight" || "ArrowLeft") {
			switchMeal(event.key);
		}
	}
};

// Get meal id from clicked recipe in recipe-list
const handleMealSelect = (event) => {
	if (event.target.id !== "meal-results") {
		const mealID = event.target.closest(".recipe-card").dataset.mealid;
		selectedMeal = getMealByID(mealID);
		renderSelectedMeal(selectedMeal);
	}
};

/* Populate initial results */
const initialDisplay = () => {
	const searches = [
		"curry",
		"chicken",
		"cake",
		"carrot",
		"potato",
		"salmon",
		"fish",
		"broccoli",
	];
	currentSearchTerm = searches[Math.floor(Math.random() * searches.length)];
	fetchRecipe(`search.php?s=${currentSearchTerm}`);
};

initialDisplay();

window.addEventListener("keydown", handleKeyPress);
searchInputElement.addEventListener("input", handleInputChange);
submitButtonElement.addEventListener("click", handleSubmit);
randomButtonElement.addEventListener("click", handleRandom);
mealResultsElement.addEventListener("click", handleMealSelect);

window.addEventListener("click", (event) => {
	const target = event.target;
	console.log(target);
	if (
		target.id === "selected-meal-close-button" ||
		(!selectedMealElement.contains(target) &&
			target.id !== "search" &&
			selectedMealIsOpen)
	) {
		handleSelectedMealClose();
	} else if (target.classList.contains("switch-arrow")) {
		if (target.id === "switch-arrow-back") {
			switchMeal("back");
		} else if (target.id === "switch-arrow-forward") {
			switchMeal("forward");
		}
	}
});
