import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { isNum } from './Calendar/Objectives';
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

export const DisplayInput = (object, callback) => {
  const display = Object.keys(object).map((prop) => {
    const value = object[prop];
    if (prop === 'id' || prop === 'nutriments')
      return null;
    return (
      <label key={prop+object}>
        {prop} :
        <input type="text" 
          placeholder={value}
          onChange={(event) => callback ? callback(event, object, prop) : null}/>
        <br/>
      </label>
      )
    }
  );
 return display;
}

const Recipe = () => {
  const nutrimentsInitialState = {
    lipids: '0g',
    carbs: '0g',
    proteins: '0g'
  }

 const ingredientInitialState = {
   id: -1,
   category: 'Vegetable',
   name: 'none',
   quantity: 0,
   price: 0,
   calorie: 0,
   nutriments: {...nutrimentsInitialState}
 };

  const generalInfoInitialState = {
    title: 'none',
    cookingMethod: 'None',
    id: -1
  };

  const ingredientListInitialState = [];

  const [generalInfo, setGeneralInfo] = useState({...generalInfoInitialState});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [state, dispatch] = useContext(Context);
  const [ingredient, setIngredient] = useState({...ingredientInitialState});
  const [ingredientList, setIngredientList] = useState(...ingredientListInitialState);
  const [nutriments, setNutriments] = useState({...nutrimentsInitialState});
  const [errorMessage, setErrorMessage] = useState('');
  const recipesRoute = 'http://localhost:3000/recipes';
  let history = useHistory();

  const createRecipe = async (event) => {
    let recipeId = state.recipes.length <= 0 ? 0 : state.recipes[state.recipes.length - 1].generalInformation.id + 1;
    const recipe = [];

    if (recipeId === -1) {
      return;
    }

    recipe.push({
      generalInformation: {
        ...generalInfo,
        id: recipeId
      },
      ingredients: [
        ...ingredientList
      ]
     }
    );

    try {
        await axios.post(recipesRoute, 
        {
           recipes: [...state.recipes, ...recipe]
        })
    } catch (err) {
      console.log(err);
    }
    dispatch({type: 'ADD_RECIPE', payload: [...state.recipes, ...recipe]});
    if (state.auth.token)//Check from server if token is valid
      dispatch({type: 'DISPLAY_ADD', payload: {displayDay: false, selectedDay: state.selectedDay.day}});
    else {
      setIngredientList([...ingredientListInitialState]);
      history.push('/');
    }
    setIngredientList([...ingredientListInitialState]);
  }

  const modifyRecipe = () => {
    let modified = [];
    if (selectedRecipe) {
      modified = state.recipes.map(recipe => {
        if (recipe.generalInformation.id === selectedRecipe.generalInformation.id)
          recipe = {...selectedRecipe, ingredients: [...ingredientList]};
        return recipe;
      });
    }
    setIngredient(ingredientInitialState);
    setNutriments(nutrimentsInitialState)
    dispatch({type: 'ADD_RECIPE', payload: [...modified]});
  }

  const handleIngredientChange = (event, object, prop) => {
    if (event.target.value !== '') {
      if (typeof(object[prop]) === 'number') {
        if (!isNum(event.target.value)) {
          object[prop] = ingredient[prop];
          if (errorMessage === '') {
            setErrorMessage(`'${prop}' needs to be a number`);
            return;
          }
        }
        else {
          object[prop] = parseInt(event.target.value);
          object[prop] = (isNaN(object[prop])) ? 0 : object[prop];
        }
      }
      else
        object[prop] = event.target.value;
      setIngredient({...object});
    }
  }

  const handleNutrimentChange = (event, object, prop) => {
    if (event.target.value !== '') {
      let nutriment = event.target.value;
      if (nutriment[nutriment.length] !== 'g') {
        nutriment += 'g';
      }
      if (!isNaN(event.target.value)) {
        object[prop] = event.target.value;
      }
      else
        object[prop] = nutriments[prop];
      setNutriments({...object});
      setIngredient({...ingredient, nutriments: {...object}});
    }
  };

  const addIngredient = () => {
    if (ingredient?.id === -1 && ingredient.name !== 'none') {
      let ingredients = [];
        if (ingredientList?.length) {
          if (ingredientList.find((ing) => ing.name === ingredient.name)) {
            setErrorMessage(`${ingredient.name} already exists, choose another name`);
            return;
          }
          ingredients = ingredientList.map(ing => ing);
        }
      ingredients.push({
        id: (ingredients.length ? ingredients[ingredients.length - 1].id + 1 : 0),
        category: ingredient.category,
        name: ingredient.name,
        quantity: ingredient.quantity,
        price: ingredient.price,
        calorie: ingredient.calorie,
        nutriments: {...nutriments}
      });
    setIngredientList([...ingredients]);
    setIngredient({...ingredient, id: -1, name: 'none'});
  }
 };

 const modifyIngredient = () => {
   if (ingredientList.find((ing) => ing.name === ingredient.name && ing.id !== ingredient.id)) {
        setErrorMessage(`${ingredient.name} already exists, please concider another name`);
        return;
   }
   let ingredients = ingredientList.map((ing) => ing.id === ingredient.id ? ingredient : ing);
   setIngredientList([...ingredients]);
 }

 const handleSetSelectedRecipe = (e) => {
      if (e.target.value === 'none') {
        setSelectedRecipe(null);
        setIngredient(ingredientInitialState);
        setIngredientList(ingredientListInitialState);
        setGeneralInfo({...generalInfo, cookingMethod: 'None'});
        return;
      }
      for (let i = 0; i < state.recipes.length; i++)
      {
        if (state.recipes[i].generalInformation.id.toString() === e.target.value) {
          setSelectedRecipe({...state.recipes[i]});
          setIngredient(ingredientInitialState);
          let ingredients = [];
          for (let j = 0; j < state.recipes[i].ingredients.length; j++) {
            ingredients.push(state.recipes[i].ingredients[j]);
          }
          setIngredientList([...ingredients]);
          setGeneralInfo({...generalInfo, cookingMethod: state.recipes[i].generalInformation.cookingMethod});
          break;
        }
      }
    };

    const handleSetIngredient = (event) => {
      if (selectedRecipe) {
        if (event.target.value === 'None') {
          setIngredient({...ingredient, id: -1, name: 'none'});
          setNutriments({...nutrimentsInitialState});
          return;
        }
        if (!ingredientList.find((ing) => ing.id.toString() === event.target.value))
          return;
        setIngredient({...selectedRecipe?.ingredients[event.target.value]});
        setNutriments({...selectedRecipe?.ingredients[event.target.value].nutriments});
      }
    }

    const handleSetCookingMethod = (e) => {
      if (selectedRecipe) {
        setSelectedRecipe({...selectedRecipe, generalInformation: {
            ...selectedRecipe.generalInformation,
            cookingMethod: e.target.value
          }});
      }
      setGeneralInfo({...generalInfo, cookingMethod: e.target.value})
    };

    const handleSetTitle = (e) => {
      if (selectedRecipe && e.target.value !== '') {
        setSelectedRecipe({...selectedRecipe, generalInformation: {
          ...selectedRecipe.generalInformation,
          title: e.target.value
        }});
      }
      else if (e.target.value !== '') {
        setGeneralInfo({...generalInfo, title: e.target.value});
      }
    }

    const cancelModifyRecipe = () => {
      let fakeEvent = {target: {value: 'none'}};
      handleSetSelectedRecipe(fakeEvent);
    }

    const handleRemoveIngredient = (id) => {
      let ingredients = ingredientList.map(ing => ing);//Utilisation ingredients
      ingredients.splice(id, 1);
      setIngredientList([...ingredients]);
    }

    const isIngredientInList = (id) => {
      return (ingredientList?.find(el => el.id === id));
    }

  return (
    <div style={styles.container}>
      <h1>Create recipe</h1>
      <div style={{position: "absolute", float: 'left', display: 'block', textAlign: 'left'}}>
        <h4>Current ingredients : </h4>
        <ul>
          {ingredientList?.map((ingred, id) => 
            <li style={{border: '1px solid red'}} key={ingred.name.toString()} onClick={(e) => handleSetIngredient(e)}>
              <button style={styles.deleteButton} onClick={() => handleRemoveIngredient(id)}>X</button>
              {ingred.name}
            </li>)}
        </ul>
      </div>
      <div style={{textAlign: 'center'}}>
        <label>
          <h4>Recipe name</h4>
          <input type="text" placeholder={selectedRecipe?.generalInformation.title} onChange={handleSetTitle}/>
        </label>
        {state.recipes.length ? (
          <div>
            <span>Or select recipe</span>
            <select name="Select recipe" onChange={handleSetSelectedRecipe} selected={selectedRecipe?.generalInformation?.id}>
              <option key={0} value='none'>none</option>
             {state.recipes.map((recipe, id) => {
                 return (
                   <option key={recipe.toString() + id} value={recipe.generalInformation.id}>
                     {recipe.generalInformation.id}: {recipe.generalInformation.title}
                   </option>
                   )
               })}
             </select>
           </div>
        ) : (null)}
        <h4>Cooking method</h4>
        <select name="cooking methods" selected={true} value={selectedRecipe?.generalInformation.cookingMethod} onChange={handleSetCookingMethod}>
          <option value="None">None</option>
          <option value="Oven">Oven</option>
          <option value="Microwave">Microwave</option>
          <option value="Steam">Steam cooking</option>
          <option value="Pan">Pan cooking</option>
        </select>
        <h4>New ingredient</h4>
        <div>
          {selectedRecipe ? ( 
           <select name="Select ingredient" onChange={handleSetIngredient} selected={ingredient?.name === 'none' ? 'None' : ingredient?.name}>
             <option key={selectedRecipe.generalInformation.toString()} value='None'>New</option>
            {selectedRecipe.ingredients.map((ingred, id) =>
            <option key={ingred.toString()+ingred.id} value={id}>
              {ingred.name}
            </option>)}
           </select>) : null}
        </div>
        <form style={styles.form} onSubmit={(event) => event.preventDefault}>
          {DisplayInput({...ingredient}, handleIngredientChange)}
          {DisplayInput({...nutriments}, handleNutrimentChange)}
        </form>
        <button style={{display: 'block', margin: '0 auto 10px auto', width: '100%'}}
        onClick={isIngredientInList(ingredient?.id) ?  modifyIngredient : addIngredient}>{isIngredientInList(ingredient?.id) ? `Change ${ingredient?.name}` : 'add'}</button>
      </div>
      {ingredientList && (
      <div>
        {!selectedRecipe ? (
        <button style={styles.submitButton} onClick={createRecipe}>Create recipe</button>
        ) : (
        <div>
          <button style={styles.submitButton} onClick={modifyRecipe}>Modify recipe</button>
          <button style={styles.submitButton} onClick={cancelModifyRecipe}>Cancel</button>
        </div>
        )}
        {errorMessage !== '' && (
          <span style={{border: '1px solid black', color: 'red'}}>
            <button style={styles.deleteButton} onClick={() => setErrorMessage('')}>
              X
            </button>
            {errorMessage}
          </span>
        )}
      </div>
      )}
    </div>
  );
};

export default Recipe;