const searchInputElement = document.querySelector("#search"),
	submitButtonElement = document.querySelector("#search-submit"),
	randomButtonElement = document.querySelector("#search-random"),
	mealResultsElement = document.querySelector("#meal-results"),
	selectedMealElement = document.querySelector("#selected-meal"),
	searchResultsHeading = document.querySelector("#search-results-heading");

let currentSearchTerm;
let mealResults;
let testMeal = {
	idMeal: "52814",
	strMeal: "Thai Green Curry",
	strDrinkAlternate: null,
	strCategory: "Chicken",
	strArea: "Thai",
	strInstructions:
		"Put the potatoes in a pan of boiling water and cook for 5 minutes. Throw in the beans and cook for a further 3 minutes, by which time both should be just tender but not too soft. Drain and put to one side.\r\nIn a wok or large frying pan, heat the oil until very hot, then drop in the garlic and cook until golden, this should take only a few seconds. Don’t let it go very dark or it will spoil the taste. Spoon in the curry paste and stir it around for a few seconds to begin to cook the spices and release all the flavours. Next, pour in the coconut milk and let it come to a bubble.\r\nStir in the fish sauce and sugar, then the pieces of chicken. Turn the heat down to a simmer and cook, covered, for about 8 minutes until the chicken is cooked.\r\nTip in the potatoes and beans and let them warm through in the hot coconut milk, then add a lovely citrussy flavour by stirring in the shredded lime leaves (or lime zest). The basil leaves go in next, but only leave them briefly on the heat or they will quickly lose their brightness. Scatter with the lime garnish and serve immediately with boiled rice.",
	strMealThumb:
		"https://www.themealdb.com/images/media/meals/sstssx1487349585.jpg",
	strTags: "Curry,Mild",
	strYoutube: "https://www.youtube.com/watch?v=LIbKVpBQKJI",
	strIngredient1: "potatoes",
	strIngredient2: "green beans",
	strIngredient3: "sunflower oil",
	strIngredient4: "garlic",
	strIngredient5: "Thai green curry paste",
	strIngredient6: "coconut milk",
	strIngredient7: "Thai fish sauce",
	strIngredient8: "Sugar",
	strIngredient9: "Chicken",
	strIngredient10: "lime",
	strIngredient11: "basil",
	strIngredient12: "Rice",
	strIngredient13: "",
	strIngredient14: "",
	strIngredient15: "",
	strIngredient16: "",
	strIngredient17: "",
	strIngredient18: "",
	strIngredient19: "",
	strIngredient20: "",
	strMeasure1: "225g new",
	strMeasure2: "100g ",
	strMeasure3: "1 tbsp",
	strMeasure4: "1 clove",
	strMeasure5: "4 tsp ",
	strMeasure6: "400ml",
	strMeasure7: "2 tsp",
	strMeasure8: "1 tsp",
	strMeasure9: "450g boneless",
	strMeasure10: "2 fresh kaffir leaves",
	strMeasure11: "handfull",
	strMeasure12: "Boiled",
	strMeasure13: "",
	strMeasure14: "",
	strMeasure15: "",
	strMeasure16: "",
	strMeasure17: "",
	strMeasure18: "",
	strMeasure19: "",
	strMeasure20: "",
	strSource: "http://www.bbcgoodfood.com/recipes/3235/thai-green-chicken-curry",
	dateModified: null,
};

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
		} else if (meals.length > 1) {
			await renderMealResults(meals, search);
		} else if (meals.length === 1) {
			await renderSelectedMeal(meals);
		}
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

const getMealByID = (id) => {
	const selectedMeal = mealResults.find((item) => item.idMeal === id);
	return selectedMeal;
};

// Render single selected meal HTML
const renderSelectedMeal = (meal) => {
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
			console.log(ingredient);
		}
	}

	const ingredientList = ingredients
		.map((item) => {
			return `
			<li><span class="ingredient-list__ingredient">${item.ingredient}</span>${
				item.measure
					? ` - <span class="ingredient-list__measure">${item.measure}</span>`
					: ""
			}</li>
		`;
		})
		.join("");
	selectedMealElement.innerHTML = `
	<h2>${meal.strMeal}</h2>
	<div class="selected-meal__info">
		<div class="selected_meal__basic-info">
			<span class="selected-meal__area">${strArea}</span> | 
		 	<span class="selected-meal__category">${strCategory}</span>
		</div>
		 <a href="${strYoutube}"><i class="fab fa-youtube"></i></a>
	</div>
	<div class="selected-meal__top">
		<div class="selected-meal__ingredients">
			<h3>Ingredients</h3>
			<ul class="selected-meal__ingredient-list">
				${ingredientList}
			</ul>
		</div>
		<img src=${strMealThumb} alt=${strMeal} class="selected-meal__image"/>
	</div>
	<div class="selected-meal__instructions">
		<p>${strInstructions}</p>
	</div>

	`;
};

renderSelectedMeal(testMeal);

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

const handleMealSelect = (event) => {
	const mealID = event.target.closest(".recipe-card").dataset.mealid;
	selectedMeal = getMealByID(mealID);
	console.log(selectedMeal);
	renderSelectedMeal(selectedMeal);
};

window.addEventListener("keyup", handleKeyPress);
searchInputElement.addEventListener("input", handleInputChange);
submitButtonElement.addEventListener("click", handleSubmit);
randomButtonElement.addEventListener("click", handleRandom);
mealResultsElement.addEventListener("click", handleMealSelect);
