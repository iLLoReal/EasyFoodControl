import React, { useContext, useState } from 'react';
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
    console.log(typeof(prop));
    return (
      <label key={prop+object}>
        {prop} :
        <input type="text" placeholder={value} onChange={(event) => callback ? callback(event, object, prop) : null}/>
        <br/>
      </label>
      )
    }
  );
 return display;
}

const Recipe = () => {
  const ingredientInitialState = {
    id: -1,
    category: 'Vegetable',
    name: 'none',
    quantity: '0',
    price: '0',
    calorie: '0',
    nutriments: {lipids: '0g', carbs: '0g', proteins: '0g'}
  };

  let ingredients = [];
  const [generalInfo, setGeneralInfo] = useState({title: 'none', cookingMethod: 'None', id: 0});
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredient, setIngredient] = useState(ingredientInitialState);
  const [state, dispatch] = useContext(Context);
  const [ingredientList, setIngredientList] = useState([{}]);
  const [nutriments, setNutriments] = useState({lipids: '0g', carbs: '0g', proteins: '0g'})
  let history = useHistory();

  const createRecipe = (event) => {
    console.log('New ingredient');
    if (state.recipes.length > 0) {
      setGeneralInfo({...generalInfo, id: state.recipes[state.recipes.length - 1].generalInformation.id + 1});
    }
    const recipe = [];
    recipe.push({
      generalInformation: {
        ...generalInfo
      },
      ingredients: [
        ...ingredients
      ]
     }
    );

    dispatch({type: 'ADD_RECIPE', payload: [...state.recipes, ...recipe]});
    if (state.auth.token)
      dispatch({type: 'DISPLAY_ADD', payload: {displayDay: false, selectedDay: state.selectedDay.day}});
    else {
      setIngredientList([{}]);
      history.push('/');
    }
    setIngredientList([{}]);
    setSelectedRecipe(null);
    console.log(`new length: ${state.recipes.length}`);
    console.log(state.recipes);
    //navigate
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
    else
    console.log("c'est la magie d'internet dans modifyRecipe");
    setSelectedRecipe(null);
    setIngredientList([{}]);
    dispatch({type: 'ADD_RECIPE', payload: [...modified]});
  }

  const handleIngredientChange = (event, object, prop) => {
    object[prop] = event.target.value;
    setIngredient({...object});
  }

  const handleNutrimentChange = (event, object, prop) => {
    let nutriment = event.target.value;
    if (nutriment[nutriment.length] !== 'g') {
      nutriment += 'g';
    }
    object[prop] = event.target.value;
    setNutriments({...object});
 };

  const addIngredient = () => {
    if (ingredient && ingredient?.name !== 'none') {
      if (ingredientList.find(a => a.name === ingredient.name)) {
        console.log(`Error : ingredient ${ingredient.name} already exists, choose another name`)
        console.log('====================================');
        console.log(ingredientList);
        console.log('====================================');
        return;
      }
       if (ingredients.length > 0)
         ingredient.id = ingredients[ingredients.length - 1].id + 1;
       else if (selectedRecipe && ingredientList.length > 0) 
         ingredient.id = ingredientList[ingredientList.length - 1].id + 1;
       else if (ingredient.id === -1) {
         ingredient.id = 0;
       }
      ingredients.push({
        id: ingredient.id,
        category: ingredient.category,
        name: ingredient.name,
        quantity: ingredient.quantity,
        price: ingredient.price,
        calorie: ingredient.calorie,
        nutriments: {...nutriments}
      });
    }
    if (selectedRecipe) {
      console.log('it is selected');
      setIngredientList([...ingredientList, ...ingredients]);
      setIngredient(ingredientInitialState)
    }
      else
      console.log("c'est la magie d'internet dans AddIngredient");
 };

 const modifyIngredient = () => {
   ingredients = ingredientList.map((ing) => ing.id === ingredient.id ? ingredient : ing);
   setIngredientList([...ingredients]);
   console.log(`Ingredient list is now ${JSON.stringify(ingredientList)}`);
   for (let i = 0; i < state.recipes.length; i++) {
     if (state.recipes[i].generalInformation.id === selectedRecipe.generalInformation.id) {
        console.log(`Dans notre state on a ${JSON.stringify(state.recipes[i].ingredients)}`);
      }
   }
  }

 const handleSetSelectedRecipe = (e) => {
  //    const recipe = JSON.parse(e);
      if (e.target.value === 'none') {
        setSelectedRecipe(null);
        setIngredient(ingredientInitialState);
        setIngredientList([{}]);
        setGeneralInfo({...generalInfo, cookingMethod: 'None'});
        return;
      }
      for (let i = 0; i < state.recipes.length; i++)
      {
        if (state.recipes[i].generalInformation.id.toString() === e.target.value) { // Remplacer par une ID
          setSelectedRecipe(state.recipes[i])
          setIngredient(ingredientInitialState); //gaffe a la copy en profondeur ou non
          for (let j = 0; j < state.recipes[i].ingredients.length; j++) {
            console.log(`added ${JSON.stringify(state.recipes[i].ingredients[j])} to ingredients`);
            ingredients.push(state.recipes[i].ingredients[j]);
          }
          setIngredientList([...ingredients]);
          console.log(`ingredientList: ${JSON.stringify(ingredientList)}`);
          setGeneralInfo({...generalInfo, cookingMethod: state.recipes[i].generalInformation.cookingMethod});
          break;
        }
      }
    };

    const handleSetIngredient = (event) => {
      if (event.target.value === 'None') {
        setIngredient(ingredientInitialState);
        console.log(ingredient);
        return;
      }
      setIngredient({...selectedRecipe?.ingredients[event.target.value]});
      setNutriments({...selectedRecipe?.ingredients[event.target.value].nutriments});
    }

    const handleSetCookingMethod = (e) => {
      if (selectedRecipe) {
        console.log("On m'a bien baisé");
        setSelectedRecipe({...selectedRecipe, generalInformation: {
            ...selectedRecipe.generalInformation,
            cookingMethod: e.target.value
          }});
      }
      else
        console.log("c'est la magie d'internet dans cooking");

      setGeneralInfo({...generalInfo, cookingMethod: e.target.value})
    };

    const handleSetTitle = (e) => {
      if (selectedRecipe) {
        setSelectedRecipe({...selectedRecipe, generalInformation: {
          ...selectedRecipe.generalInformation,
          title: e.target.value
        }});
      }
      else
        console.log("c'est la magie d'internet dans title");
      setGeneralInfo({...generalInfo, title: e.target.value});
      console.log('====================================');
      console.log(generalInfo);
      console.log('====================================');
    }

    const cancelModifyRecipe = () => {
      let fakeEvent = {target: {value: 'none'}};
      handleSetSelectedRecipe(fakeEvent);
    }

    const handleRemoveIngredient = (id) => {
      ingredients = ingredientList.map(ing => ing);//Utilisation ingredients
      ingredients.splice(id, 1);
      setIngredientList([...ingredients]);
    }

  return (
    <div style={styles.container}>
      <h1>Create recipe</h1>
      <div style={{position: "absolute", float: 'left', display: 'block'}}>
        <h4>Current ingredients : </h4>
        <ul>
          {selectedRecipe ? ingredientList.map((ingred, id) => 
            <li key={ingred}>{ingred.name}
              <button style={styles.deleteButton} onClick={() => handleRemoveIngredient(id)}>X</button>
            </li>) : null}
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
            <select name="Select recipe" onChange={handleSetSelectedRecipe} selected={selectedRecipe?.generalInformation.title}>
              <option key={0} value='none'>none</option>
             {state.recipes.length ?
               state.recipes.map((recipe, id) => {
                 return (
                   <option key={recipe} value={recipe.generalInformation.id}>
                     {recipe.generalInformation.id}: {recipe.generalInformation.title}
                   </option>
                   )
               }) : <option value={'empty'}>No recipe</option>}
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
             <option key={selectedRecipe.generalInformation} value='None'>New</option>
            {selectedRecipe.ingredients.map((ingred, id) =>
            <option key={JSON.stringify(ingred)} value={id}>
              {ingred.name}
            </option>)}
           </select>) : null}
        </div>
        <form style={styles.form} onSubmit={(event) => event.preventDefault}>
          {DisplayInput({...ingredient}, handleIngredientChange)}
          {DisplayInput({...nutriments}, handleNutrimentChange)}
        </form>
        <button style={{display: 'block', margin: '0 auto 10px auto', width: '100%'}}
        onClick={(ingredientList?.find(el => el.id === ingredient?.id)) ?  modifyIngredient : addIngredient}>{(ingredientList?.find(el => el.id === ingredient?.id)) ? `Change ${ingredient.name}` : 'add'}</button>
      </div>
      <div>
        {!selectedRecipe && (
        <button style={styles.submitButton} onClick={createRecipe}>Create recipe</button>
        )}
        {selectedRecipe && (
          <div>
            <button style={styles.submitButton} onClick={modifyRecipe}>Modify recipe</button>
            <button style={styles.submitButton} onClick={cancelModifyRecipe}>Cancel</button>
          </div>)}
      </div>
    </div>
  );
};

export default Recipe;