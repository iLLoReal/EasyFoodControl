import React, { useContext, useState } from 'react';
import Recipe from './Recipes';
import { Context } from './State/Provider/Store';
import * as actions from './State/Reducer/Reducer.constants';

const Day = () => {
  const [state, dispatch] = useContext(Context)
  const [displayCreateRecipe, setDisplayCreateRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const meal = { day: state.selectedDay.day, recipes: []};
  const [recipeList, setRecipeList] = useState([]);

  const styles = {
    button: {
      display: 'block',
      margin: '1vw auto'
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
        <div style={{float: 'right', width: '50%'}}>
          {displayCreateRecipe ? <Recipe /> : null}
        </div>
        
      </div>
    );
  }

  const handleSetSelectedRecipe = (recipe) => {
    console.log(recipe.generalInformation.title);
    setSelectedRecipe(recipe);
  };
  

  const SelectRecipe = () => {
    return state.recipes.length ? (
      <div> 
        <span>Select recipe </span>
        <select style={styles.select} name="Select recipe">
          {state.recipes ?
            state.recipes.map((recipe, id) => {
              return (
                <option key={id} value={recipe.generalInformation.title} onSelect={handleSetSelectedRecipe(recipe)}>
                  {recipe.generalInformation.title}
                </option>
                )
            }) : <option value={'empty'}></option>}
        </select>
      </div>
    ) : null;
  }

  const CreateRecipe = () => {
    return (
    <div>
      <button style={styles.button} onClick={() => setDisplayCreateRecipe(true)}>
        Create recipe
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

  const AddRecipe = () => {
    return selectedRecipe ? (
      <div style={{width: '100%'}}>
        <button onClick={handleAddRecipe}>ADD RECIPE</button>
      </div>
    ) : <text>this should be displaying</text>;
  };

  const addMeal = (selectedRecipe) => {
    recipeList.map((recipe) => meal.recipes.push(recipe));
    dispatch({type: actions.ADD_MEAL, action: meal});
    console.log('Added meal to scheduler');
    recipeList = [];
  };

  const Validate = () => {
    return (
      <div>
        <ul>
          {recipeList ? recipeList.map((recipe, id) => <li key={id}>{recipe.generalInformation.title}</li>) : null}
        </ul>
        <button onClick={() => addMeal}>Validate Meal</button>
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