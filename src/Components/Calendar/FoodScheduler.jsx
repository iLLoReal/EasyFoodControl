import React, { useContext, useEffect, useReducer, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './Day.css';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants'

const FoodSchedule = () => {
  const [state, dispatch] = useContext(Context);
  const [display, setDisplay] = useState(false);
  const [selectedDay, setSelectedDay] = useState({display: false, day: 'none'})

    useEffect(() => {
    //get recipes from axios to AsyncLocal 
    });

  const DisplayRecipes = (gDate) => {
    //console.log(state.selectedDay.day)
    let recipes = '';
    let calories = 0;
    for (let mealsIndex = 0; mealsIndex < state.meals.length; mealsIndex++) {
      if (state.meals[mealsIndex].day.toString() === gDate.gDate) {
        for (let recipesIndex = 0; recipesIndex < state.meals[mealsIndex].recipes.length; recipesIndex++) {
          for (let ingredsIndex = 0; ingredsIndex < state.meals[mealsIndex].recipes[recipesIndex].ingredients.length; ingredsIndex++) {
              calories += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].calorie, 10);
          }
        }
        recipes = state.meals[mealsIndex].recipes.map((recipe, id) => <li key={id}>{`${recipe.generalInformation.title}`}</li>);
      }
    }
    return (
      <div>
        {calories}
        {recipes}
      </div>
    );
  };
  

  const Example = ({date, view}) => {
    const handleButtonClick = () => {
        console.log('add meal');
        setDisplay(true);
        const selectedDayConst = {displayDay: display, day: date};
        setSelectedDay({...selectedDayConst})
        console.log(`now we have ${selectedDay.day}`);
        dispatch({type: actions.DISPLAY_DAY, payload: selectedDayConst});
    }

    //state.recipes?.map((recipe) => console.log(`ici ${JSON.stringify(recipe)}`))


/*    if (state.recipes.length) {
      state.recipes.map((recipe) => console.log(recipe.generalInformation.title));
    }*/

    const dateToString = date.toString();
    //console.log(`FFS : ${dateToString}`);
    return (
      <div onClick={handleButtonClick}>
        <br/>
        {dateToString === state.selectedDay.day.toString() && state.selectedDay.displayDay ? 'Create or choose recipe' : 'add'}  
        <DisplayRecipes gDate={date.toString()}/>
      </div>
      );
  }
  
  const HandleClickDay = (value, event) => {
    console.log('Hello');
    console.log(`This is the day : ${value}`);
    dispatch({ type: 'ADD_RECIPE', payload: state.recipes });
    dispatch({ type: 'ADD_MEAL', payload: state.recipes });
  };

  return (
    <div style={{margin: 'auto'}}>
      <div>
        test
      </div>
      <Calendar onClickDay={Example.handleButtonClick} tileContent={Example} tileClassName='toto' />
    </div>
  );
};

export default FoodSchedule;