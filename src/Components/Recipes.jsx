import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isNum } from './Calendar/Objectives';
import { Context } from './State/Provider/Store';
import RecipesApiCalls from './Api/RecipesApiCalls'
import GeneralApiCalls from './Api/GeneralApiCalls';
import LoginApiCalls from './Api/LoginApiCalls';
import * as actions from './State/Reducer/Reducer.constants';
import jwt_decode from 'jwt-decode';

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
    id: -1,
    user: {}
  };

  const ingredientListInitialState = [];

  const [generalInfo, setGeneralInfo] = useState({...generalInfoInitialState});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [state, dispatch] = useContext(Context);
  const [ingredient, setIngredient] = useState({...ingredientInitialState});
  const [ingredientList, setIngredientList] = useState(...ingredientListInitialState);
  const [nutriments, setNutriments] = useState({...nutrimentsInitialState});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState('initial');
  const [timer, setTimer ] = useState(false);
  const [title, setTitle] = useState('Recipe');
  let history = useHistory();

 

  useEffect(() => { 
    const interval = setInterval(() => {
      if (!timer) {
        setTimer(true);
      }
    }, 1000);
    const getRecipes = async () => {
       const recipesResponse = await LoginApiCalls.getRecipes();
       if (recipesResponse) {
         if (recipesResponse !== 'No recipes') {
            dispatch({type: actions.ADD_RECIPE, payload: [...recipesResponse]});
            setLoading('');
          }
         else {
           setLoading('No recipes');
         }
       }
    }
    if (!(state.recipes?.length) && (loading === 'initial' || loading === 'loading')) {

      if (loading === 'initial') {
        setLoading('loading');
      }
      if (timer) {
       getRecipes();
       setTimer(false);
      } else {

      }
    }
    return function cleanup() {
      if (interval)
        clearInterval(interval);
      setTimer(false);
    }
  }, [state, dispatch, timer, loading])

  const createRecipe = async (event) => {
    let recipeId = !state.recipes.length ? 0 : state.recipes[state.recipes.length - 1].generalInformation.id + 1;
    const recipe = [];

    if (!generalInfo.title || generalInfo?.title === 'none') {
      setErrorMessage("'Title can't be empty'");
      return;
    }

    if (recipeId === -1 || !ingredientList.length) {
      return;
    }
    let decodedToken = state.auth;
    if (decodedToken.length) {
      decodedToken = jwt_decode(decodedToken);
    }
    recipe.push({
      generalInformation: {
        ...generalInfo,
        id: recipeId,
        user: { login: decodedToken ? decodedToken.login : undefined, email: decodedToken ? decodedToken.email : undefined }
      },
      ingredients: [
        ...ingredientList
      ]
     }
    );

    const newRecipes = [...state.recipes, ...recipe];
    const added = await RecipesApiCalls.sendRecipes(newRecipes, undefined, state.auth);
    if (added === null) {
      return;
    }
    dispatch({type: 'ADD_RECIPE', payload: [...state.recipes, ...recipe]});
    setIngredientList([...ingredientListInitialState]);
    if (state.auth.length) {
      const isTokenValid = await GeneralApiCalls.verifyToken(state.auth);
      if (isTokenValid) {
        setLoading('initial');
        dispatch({type: 'DISPLAY_ADD', payload: {displayDay: false, selectedDay: state.selectedDay.day}});
      }
    }
    else {
      setLoading('initial');
      setTimer(false);
      const timeout = setTimeout(() => {
        history.push('/logout');
        clearTimeout(timeout);
      }, 1000)
    }
    setLoading('initial');
  }

  const modifyRecipe = async () => {
    let modified = [];
    let fail = false;
    if (selectedRecipe) {
      modified = state.recipes.map(recipe => {
        if (recipe.generalInformation.id === selectedRecipe.generalInformation.id) {
          if (recipe.generalInformation.title === 'none') {
              setErrorMessage("'Title' can't be empty");
              fail = true;
          }
           recipe = {...selectedRecipe, ingredients: [...ingredientList]};
        }
        return recipe;
      });
    }    
    if (fail) {
      return;
    }
/*    if (!ingredientList.length)
      modified = modified.splice(modified.indexOf((recipe) => !recipe.ingredients.length));*/
    setIngredient(ingredientInitialState);
    setNutriments(nutrimentsInitialState);
    const newRecipes = [...modified];

    const added = await RecipesApiCalls.sendRecipes(newRecipes, selectedRecipe.generalInformation.id, state.auth);
    if (added) {
      dispatch({type: 'ADD_RECIPE', payload: [...newRecipes]});
      setSelectedRecipe(null);
    }
    else {
      return;
    }
  }

  const handleIngredientChange = (event, object, prop) => {
    if (event.target.value !== '') {
      if (typeof(object[prop]) === 'number') {
        if (!isNum(event.target.value)) {
          object[prop] = ingredient[prop];
          if (errorMessage === '') {
            setErrorMessage(`'${prop}' needs to be a number`);
          }
          return;
        }
        else {
          if (errorMessage !== '')
            setErrorMessage('');
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
      if (nutriment[nutriment.length - 1] !== 'g') {
        if (!isNum(nutriment)) {
          if (errorMessage === '') {
            setErrorMessage(`'${prop}' needs to be a number`);
          }
          return;
        }
        nutriment += 'g';
      } else {
        let checkIfNumber = [...nutriment];
        checkIfNumber.splice(checkIfNumber.length - 1, 1);
        if (!isNum(checkIfNumber.join(''))) {
          if (errorMessage === '') {
            setErrorMessage(`'${prop}' needs to be a number`);
          }
          return;
        }
      }
      if (errorMessage !== '')
         setErrorMessage('');
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
      } else {
        setErrorMessage("'title' can't be empty");
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
        {loading.length ? 
        (loading === 'No recipes' ? 
          (<div>No Recipe</div>) : (loading === 'loading' ? (<div>{loading}</div>) : null)
        ) : null}

        {state.recipes.length ? (
          <div>
            <span>Or select recipe</span>
            <select name="Select recipe" onChange={handleSetSelectedRecipe} selected={selectedRecipe?.generalInformation?.id}>
              <option key={0} value='none'>none</option>
             {loading !== 'No recipes' && state.recipes.map((recipe, id) => {
               if (recipe?.ingredients?.length) {
                 return (
                   <option key={recipe.toString() + id} value={recipe.generalInformation.id}>
                     {recipe.generalInformation.id}: {recipe.generalInformation.title}
                   </option>
                   )
                 }
                return null;
               }
               )}
             </select>
             <button onClick={() => { setLoading('initial'); setTimer(false); dispatch({type: actions.ADD_RECIPE, payload: []})}}>Check for new recipes</button>
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
          <input type='reset' defaultValue='Reset'/>
        </form>
        {errorMessage === '' && 
        (<button style={{display: 'block', margin: '0 auto 10px auto', width: '100%'}}
        onClick={isIngredientInList(ingredient?.id) ?  modifyIngredient : addIngredient}>{isIngredientInList(ingredient?.id) ? `Change ${ingredient?.name}` : 'add'}</button>)}
      </div>
      {ingredientList && (
      <div>
        {errorMessage === '' &&
        !selectedRecipe ? (
        <button style={styles.submitButton} onClick={createRecipe}>Create recipe</button>
        ) : errorMessage === '' ? (
        <div>
          <button style={styles.submitButton} onClick={modifyRecipe}>Modify recipe</button>
          <button style={styles.submitButton} onClick={cancelModifyRecipe}>Cancel</button>
        </div>
        ) : null}
      </div>
      )}
      {errorMessage !== '' && (
        <div style={{border: '1px solid black', color: 'red'}}>
          <button style={styles.deleteButton} onClick={() => setErrorMessage('')}>
            X
          </button>
          {errorMessage}
         </div>
      )}
    </div>
  );
};

export default Recipe;