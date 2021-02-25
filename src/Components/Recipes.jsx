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

export const DisplayInput = (object, callback) => {
  const display = Object.keys(object).map((prop) => {
    const value = object[prop];
    if (prop === 'id')
      return null;
    return (
      <label key={prop}>
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
    id: 0,
    category: 'Vegetable',
    name: 'none',
    quantity: '0',
    price: '0',
    calorie: '0',
  };

  let ingredients = [];
  const generalInfo = {title: 'none', cookingMethod: 'None', id: 0};
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredient, setIngredient] = useState(ingredientInitialState);
  const [state, dispatch] = useContext(Context);
  const [ingredientList, setIngredientList] = useState([{}]);
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
      ingredients: [
        ...ingredients
      ]
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

  const modifyRecipe = () => {
    let modified = [];
    if (selectedRecipe) {
      modified = state.recipes.map(recipe => {
        if (recipe.generalInformation.id === selectedRecipe.generalInformation.id)
          recipe = {...selectedRecipe, ingredients: [...ingredientList]};
        return recipe;
      });
    }
    dispatch({type: 'ADD_RECIPE', payload: [...modified]});
  }

  const handleChange = (event, object, prop) => {
    object[prop] = event.target.value;
 };

  const addIngredient = () => {
    if (ingredient && ingredient?.name !== 'none') {
      if (ingredientList.find(a => a.name === ingredient.name)) {
        console.log(`Error : ingredient ${ingredient.name} already exists, choose another name`)
        return;
      }
       if (ingredients.length > 0)
         ingredient.id = ingredients[ingredients.length - 1].id + 1;
       else if (selectedRecipe && ingredientList.length > 0) 
         ingredient.id = ingredientList[ingredientList.length - 1].id + 1;
      ingredients.push({
        id: ingredient.id,
        category: ingredient.category,
        name: ingredient.name,
        quantity: ingredient.quantity,
        price: ingredient.price,
        calorie: ingredient.calorie
      });
    }
    if (selectedRecipe) {
      setIngredientList([...ingredientList, ...ingredients]);
    }
    //console.log(`pushed ${ingredient.name} in ingredients`);
    //console.log(JSON.stringify(ingredients));
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
        generalInfo.cookingMethod = 'None';
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
          generalInfo.cookingMethod = state.recipes[i].generalInformation.cookingMethod;
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
//      setIngredient({...event.target.value});
    }

    const handleSetCookingMethod = (e) => {
      if (selectedRecipe) {
        setSelectedRecipe({...selectedRecipe, generalInformation: {
            ...selectedRecipe.generalInformation,
            cookingMethod: e.target.value
          }});
      }
      generalInfo.cookingMethod = e.target.value
    };

    const handleSetTitle = (e) => {
      if (selectedRecipe) {
        setSelectedRecipe({...selectedRecipe, generalInformation: {
          ...selectedRecipe.generalInformation,
          title: e.target.value
        }});
      }
      generalInfo.title = e.target.value;
    }

    const cancelModifyRecipe = () => {
      let fakeEvent = {target: {value: 'none'}};
      handleSetSelectedRecipe(fakeEvent);
    }

    const handleRemoveIngredient = (id) => {
      ingredients = ingredientList.map(ing => ing);
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
            <li key={ingred.name+id+ingredientList.length}>{ingred.name}
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
                   <option key={recipe.generalInformation.id + 1} value={recipe.generalInformation.id}>
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
             <option key={selectedRecipe.generalInformation.title} value='None'>New</option>
            {selectedRecipe.ingredients.map((ingred, id) =>
            <option key={ingred.name + ingred.id} value={id}>
              {ingred.name}
            </option>)}
           </select>) : null}
        </div>
        <form style={styles.form} onSubmit={(event) => event.preventDefault}>
          {DisplayInput(ingredient, handleChange)}
        </form>
        <button style={{display: 'block', margin: '0 auto 10px auto', width: '100%'}} onClick={ingredient.name !== 'none' ? modifyIngredient : addIngredient}>{ingredient.name !== 'none' ? `Change ${ingredient.name}` : 'add'}</button>
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