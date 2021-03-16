import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Recipe from '../Recipes';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants';

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

const Day = () => {
  const [state, dispatch] = useContext(Context)
  const [displayCreateRecipe, setDisplayCreateRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const meal = { day: state.selectedDay.day, id: 0, recipes: []};
  const [recipeList, setRecipeList] = useState([]);
  const [selectCookingMethod, setSelectCookingMethod] = useState('None');
  const mealRoute = 'http://localhost:3000/user/meals';
  let firstMealOfTheDay = 0;

  useEffect(() => {
    let noMeals = true;
    if (state.meals.length) {
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].day.toString() === state.selectedDay.day.toString()) {
          setRecipeList([...state.meals[i].recipes]);
          if (noMeals)
            firstMealOfTheDay = i;
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
          <select name="cooking methods" onChange={(e) => setSelectCookingMethod(e.target.value)} value={selectedRecipe?.generalInformation.cookingMethod}>
            <option value="None">None</option>
            <option value="Oven">Oven</option>
            <option value="Microwave">Microwave</option>
            <option value="Steam">Steam cooking</option>
            <option value="Pan">Pan cooking</option>
          </select>
        </div>
        <span>Select recipe </span>
         <select style={styles.select} name="Select recipe" onChange={handleSetSelectedRecipe}>
           <option key={0} value='None'>None</option>
          {state.recipes ?
            state.recipes.filter(recipe => recipe.generalInformation.cookingMethod === selectCookingMethod).map((recipe, id) => {
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
        {!displayCreateRecipe === true ? 'Create recipe' : 'Stop creating recipe'}
      </button>
    </div>
    );
  }

  const DefaultDisplay = () => {
    return (
      <div>
        Select a day to start adding meals
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
    ) : <span>No recipe to display</span>;
  };

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
    try {
      await axios.post(
        mealRoute,
        {
         token: state.auth.token,
         meals: [...newMeals, meal],
        });
    }
   catch(error) {
       console.log(error);
   }
   dispatch({type: actions.ADD_MEAL, payload: [...newMeals, meal]}); // Mettre le dispatch en amont ? chopper les données quand on

   const selectedDay = {
      displayDay: false,
      day: state.selectedDay.day,
    };
    dispatch({type: actions.DISPLAY_DAY, payload: selectedDay});
  };

  const Validate = () => {
    return (
      <div>
        <ul>
          {recipeList ? recipeList.map((recipe, id) =>
          <li key={id}>{recipe.generalInformation.title}
            <button style={styles.deleteButton} onClick={() => handleRemoveRecipe(id)}>X</button>
          </li>) : null}
        </ul>
        <button style={styles.submitButton} onClick={addMeal}>Validate Meal</button>
      </div>
    );
  };

  return state.selectedDay.displayDay ? (
    <Container>
      <Header />
      <SelectRecipe />
      <CreateRecipe />
      <AddRecipe />
      <Validate />
    </Container>
  ) : <DefaultDisplay />;
};

export default Day;;