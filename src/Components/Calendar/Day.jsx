import React, { useContext, useEffect, useState } from 'react';
import Recipe from '../Recipes';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants';

const Day = () => {
  const [state, dispatch] = useContext(Context)
  const [displayCreateRecipe, setDisplayCreateRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const meal = { day: state.selectedDay.day, recipes: []};
  const [recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    console.log(`useEffect Day : ${state.selectedDay.day}, found ${state.meals.length} meals`);
    let noMeals = true;
    if (state.meals.length) {
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].day.toString() === state.selectedDay.day.toString()) {
          setRecipeList([...state.meals[i].recipes]);
          noMeals = false;
        }
        else
          console.log(`state.meals[i].day(${state.meals[i].day}) != state.selectedDay.day (${state.selectedDay.day})`);
      }
    }
    if (noMeals) {
      setRecipeList([]);
    }
  }, [state.meals, state.selectedDay.day]);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  
  const month = [
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
//    const recipe = JSON.parse(e);
    if (e.target.value === 'none')
      return;
    for (let i = 0; i < state.recipes.length; i++)
    {
      if (state.recipes[i].generalInformation.id.toString() === e.target.value) { // Remplacer par une ID
        setSelectedRecipe(state.recipes[i]); //gaffe a la copy en profondeur ou non
        break;
      }
    }
//    console.log(`changed for ${selectedRecipe.generalInformation.title}`);
  };

  const SelectRecipe = () => {
    return state.recipes.length ? (
      <div> 
        <span>Select recipe </span>
         <select style={styles.select} name="Select recipe" onChange={handleSetSelectedRecipe} value={selectedRecipe?.generalInformation.id}>
           <option key={0} value='none'>none</option>
          {state.recipes ?
            state.recipes.map((recipe, id) => {
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
    //console.log(`removing element ${recipeList[id].generalInformation.title} corresponding to number ${id}`);
    if (id > -1)
      recipeList.splice(id, 1);
    //recipeList.map((recipe, id) => console.log(`recipe ${id} : ${recipe.generalInformation.title} `));
    setRecipeList([...recipeList]);
  }

  const AddRecipe = () => {
    return selectedRecipe ? (
      <div style={{width: '100%'}}>
        <button onClick={handleAddRecipe}>ADD RECIPE</button>
      </div>
    ) : <text>this should be displaying</text>;
  };

  const addMeal = () => {
    recipeList.map((recipe) => meal.recipes.push(recipe));
    dispatch({type: actions.ADD_MEAL, payload: [...state.meals, meal]});
    const selectedDay = {
      displayDay: false,
      day: state.selectedDay.day,
    };
    dispatch({type: actions.DISPLAY_DAY, payload: selectedDay});
    console.log('Added meal to scheduler');
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