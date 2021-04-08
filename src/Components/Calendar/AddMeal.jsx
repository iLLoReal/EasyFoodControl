import React, { useContext, useEffect, useState } from 'react';

import Recipe from '../Recipes';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants';
import AddMealsApiCalls from '../Api/AddMealsApiCalls';


export const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const AddMeal = () => {
  const [state, dispatch] = useContext(Context)
  const [displayCreateRecipe, setDisplayCreateRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const meal = { day: state.selectedDay.day, id: 0, recipes: []};
  const [recipeList, setRecipeList] = useState([]);
  const [selectCookingMethod, setSelectCookingMethod] = useState('');
  const [displayRecipe, setDisplayRecipe] = useState(false);

  useEffect(() => {
    let noMeals = true;
    if (state.meals.length) {
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].day.toString() === state.selectedDay.day.toString()) {
          setRecipeList([...state.meals[i].recipes]);
          noMeals = false;
        }
      }
    }
    if (noMeals) {
      setRecipeList([]);
    }
  }, [state.meals, state.selectedDay.day]);

  const styles = {
    button: {
      display: 'block',
      margin: '1vw auto'
    },
    deleteButton: {
      color: 'red',
      marginLeft: '10px',
      borderRadius: '100%'
    },
    submitButton: {
      borderRadius: '10%',
      borderStyle: 'solid',
      borderColor: 'cyan',
      backgroundColor: 'cyan',
      width: '100%',
      height: 'auto',
      marginBottom: 0
    },
    select: {
      display: 'inline-block',
      margin: '0 auto'
    },
    container: {
      display: 'block',
      textAlign: 'center',
    }
  };

  const Header = () => {
    return (
      <div style={{display: 'block', border: '1px solid black'}}>
        <div style={{display: 'block', border: '1px solid black'}}>
          <h1>
            {`${weekday[state.selectedDay.day.getDay()]} 
            ${month[state.selectedDay.day.getMonth()]}
            ${state.selectedDay.day.getDate()}`}
         </h1>
       </div>
        <div style={{float: 'right', width: '50%'}}>
          {displayCreateRecipe ? <Recipe /> : null}
        </div>
      </div>
    );
  }

  const handleSetSelectCookingMethod = (e) => {
    setSelectCookingMethod(e.target.value);
  }

  const handleSetSelectedRecipe = (e) => {
    if (e.target.value === 'None')
      return;
    for (let i = 0; i < state.recipes.length; i++)
    {
      if (state.recipes[i].generalInformation.id.toString() === e.target.value) {
        setSelectedRecipe(state.recipes[i]);
        break;
      }
    }
  };

  const SelectRecipe = () => {
    return state.recipes.length ? (
      <div>
        <div>
          <span>Select Cooking Method </span>
          <select
            name="cooking methods"
            selected={selectedRecipe?.generalInformation?.cookingMethod || selectCookingMethod}
            onChange={handleSetSelectCookingMethod}
          >
            <option value="None">None</option>
            <option value="Oven">Oven</option>
            <option value="Microwave">Microwave</option>
            <option value="Steam">Steam cooking</option>
            <option value="Pan">Pan cooking</option>
          </select>
        </div>
        <span>
          Select recipe
        </span>
        <select 
          name="Select recipe"
          style={styles.select}
          onChange={handleSetSelectedRecipe}
        >
          <option key={0} value='None'>None</option>
          {state.recipes ?
            state.recipes.filter(recipe => 
              recipe.generalInformation.cookingMethod === selectCookingMethod)
              .map((recipe, id) => {
                return (
                  <option key={id + 1} value={recipe.generalInformation.id}>
                    {recipe.generalInformation.id}: {recipe.generalInformation.title}
                  </option>
                )
              }) : <option value={'empty'}>No recipe</option>}
          </select>
      </div>
    ) : null;
  }

  const CreateRecipe = () => {
    return (
    <div>
      <button style={styles.button} onClick={() => setDisplayCreateRecipe(!displayCreateRecipe)}>
        {!displayCreateRecipe === true ? 'Create recipe/Check database' : 'Stop creating recipe'}
      </button>
    </div>
    );
  }

  const DefaultDisplay = () => {
    return (
      <div>
        <h2>Select a day to start adding meals</h2>
      </div>
    );
  };
  
  const Container = ({children}) => {
    return (
      <div style={styles.container}>
        {children}
      </div>
    );
  };
  
  const handleAddRecipe = () => {
    if (selectedRecipe) {
        setRecipeList([...recipeList, selectedRecipe]);
      }
  }

  const handleRemoveRecipe = (id) => {
    if (id > -1)
      recipeList.splice(id, 1);
    setRecipeList([...recipeList]);
  }

  const AddRecipe = () => {
    return selectedRecipe ? (
      <div style={{width: '100%'}}>
        <button onClick={handleAddRecipe}>ADD RECIPE</button>
      </div>
    ) : state.recipes.length ? <span>Select a recipe to add</span> : <span>Check database for recipes</span>
  };

  const handleSetDisplayRecipe = () => {
    setDisplayRecipe(!displayRecipe);
  }

  const DisplayIngredients = () => {
    return recipeList.length ? (
      <div style={{float: 'right'}}>
        <button onClick={handleSetDisplayRecipe}>{!displayRecipe ? 'Display ingredients' : 'Hide ingredients'}</button>
      </div>
    ):null;
  }

  const getFirstMealOfTheDay = () => {
    let noMeals = true;
    let firstMealOfTheDay = -1;
    if (state.meals.length) {
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].day.toString() === state.selectedDay.day.toString()) {
          if (noMeals)
            firstMealOfTheDay = i;
          noMeals = false;
        }
      }
    }
    return firstMealOfTheDay;
  }

  const addMeal = async () => {
    recipeList.map((recipe) => meal.recipes.push(recipe));
    const newMeals = state.meals.map(meal => meal);
    meal.id = getFirstMealOfTheDay();
    if (meal.id === -1) {
      meal.id = state.meals.length + 1;
    }
    newMeals.splice(meal.id, 1);
    const addMealsResponse = await AddMealsApiCalls.sendMeals(state.auth, [...newMeals, meal]);
    if (addMealsResponse === false) {
      console.log('Unauthorized');
    } else if (addMealsResponse === null) {
      console.log('Server error');
    }
   dispatch({type: actions.ADD_MEAL, payload: [...newMeals, meal]}); // Mettre le dispatch en amont ? chopper les données quand on

   const selectedDay = {
      displayDay: false,
      day: state.selectedDay.day,
    };
    dispatch({type: actions.DISPLAY_DAY, payload: selectedDay});
  };

  const cancelAddMeal = () => {
    const selectedDay = {
      displayDay: false,
      day: state.selectedDay.day,
    };
    dispatch({type: actions.DISPLAY_DAY, payload: selectedDay});
  }

  const Validate = () => {
    return (
      <div style={{textAlign: 'left'}}>
        <ul>
          {recipeList ? recipeList.map((recipe, id) =>
          <li key={id} >{recipe.generalInformation.title}
          <button style={styles.deleteButton} onClick={() => handleRemoveRecipe(id)}>X</button>
          {displayRecipe && 
            <ul>
              {recipe.ingredients.map((ingredient) => 
                <li key={ingredient.name + ingredient.id + id}>
                  {ingredient.category} : {ingredient.name} ({ingredient.calorie} kcal)
                  <div>lipids: {ingredient.nutriments.lipids}</div>
                  <div>carbs: {ingredient.nutriments.carbs}</div>
                  <div>proteins: {ingredient.nutriments.proteins}</div>
                </li>)}
            </ul>}
          </li>) : null}
        </ul>
        <button style={styles.submitButton} onClick={addMeal}>Validate Meal</button>
        <button style={styles.submitButton} onClick={cancelAddMeal}>Cancel</button>
      </div>
    );
  };

  return state.selectedDay.displayDay ? (
    <Container>
      <Header />
      <SelectRecipe />
      <CreateRecipe />
      <AddRecipe />
      <DisplayIngredients/>
      <Validate />
    </Container>
  ) : <DefaultDisplay />;
};

export default AddMeal;