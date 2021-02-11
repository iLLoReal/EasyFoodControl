import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from './State/Provider/Store';


const styles = {
  container: {
    textAlign: 'center',
    border: '1px solid black',
    height: 'auto',
    margin: 'auto',
    marginBottom: '10px'
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
  addButton: {
    width: 'auto',
    height: 'auto',
    marginBottom: 0
  },
  form: {
    display: 'inline-block',
    margin: 'auto',
    textAlign: 'right'
  }
};

const Recipe = () => {
  const ingredientInitialState = {
    name: 'none',
    quantity: '0',
    price: '0',
    calorie: '0',
  };

  const ingredients = [];
  const generalInfo = {title: 'none', cookingMethod: 'none', id: 0};
  const [ingredient, setIngredient] = useState(ingredientInitialState);
  const [state, dispatch] = useContext(Context);
  let history = useHistory();

  const createRecipe = (event) => {
    console.log('New ingredient');
    if (state.recipes.length > 0) {
      generalInfo.id = state.recipes[state.recipes.length - 1].generalInformation.id + 1;
    }
    const recipe = [];
    recipe.push({
      generalInformation: {
        ...generalInfo
      },
      ingredients: {
        ...ingredients
      }
     }
    );

    dispatch({type: 'ADD_RECIPE', payload: [...state.recipes, ...recipe]});
    if (state.auth.token)
      dispatch({type: 'DISPLAY_ADD', payload: {displayDay: false, selectedDay: state.selectedDay.day}});
    else
      history.push('/');
    console.log(`new length: ${state.recipes.length}`);
    console.log(state.recipes);
    //navigate
  }

  const handleChange = (event, object, prop) => {
    object[prop] = event.target.value;
 };

  const addIngredient = () => {
    if (ingredient && ingredient.name !== 'none') {
      ingredients.push({
        name: ingredient.name,
        quantity: ingredient.quantity,
        price: ingredient.price,
        calorie: ingredient.calorie
      });
    }
    //console.log(`pushed ${ingredient.name} in ingredients`);
    //console.log(JSON.stringify(ingredients));
 };

  const DisplayInput = (object, callback) => {
    const display = Object.keys(object).map((prop) => {
      return (
        <label key={prop}>
          {prop} :
          <input type="text" onChange={(event) => callback(event, object, prop)}/>
          <br/>
        </label>
   )});
   return display;
 }
/* name: 'cheese',
 quantity: 28,
 price: 0,
 calorie: 106
*/
  return (
    <div style={styles.container}>
      <h1>Create recipe</h1>
      <div style={{textAlign: 'center'}}>
        <label>
        <h4>Recipe name</h4>
          <input type="text" onChange={(event) => generalInfo.title = event.target.value}/>
        </label>
        <h4>Cooking method</h4>
        <select name="cooking methods">
          <option value="none" onSelect={() => generalInfo.cookingMethod = "none"}>None</option>
          <option value="oven" onSelect={() => generalInfo.cookingMethod = "oven"}>Oven</option>
          <option value="microwave" onSelect={() => generalInfo.cookingMethod = "microwave"}>Microwave</option>
          <option value="steam" onSelect={() => generalInfo.cookingMethod = "steam"}>Steam cooking</option>
          <option value="pan" onSelect={() => generalInfo.cookingMethod = "pan"}>Pan cooking</option>
        </select>
        <h4>New ingredient</h4>
        <form style={styles.form} onSubmit={(event) => event.preventDefault}>
          {DisplayInput(ingredient, handleChange)}
        </form>
        <button style={styles.addButton} onClick={addIngredient}>add</button>
      </div>
      <button style={styles.submitButton} onClick={createRecipe}>Create recipe</button>
    </div>
  );
};

export default Recipe;