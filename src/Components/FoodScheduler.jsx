import React, { useContext, useEffect, useReducer, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './Day.css';
import Recipe from './Recipes';
import { Context } from './State/Provider/Store';
import * as actions from './State/Reducer/Reducer.constants'

const FoodSchedule = () => {
  const [state, dispatch] = useContext(Context);
  const [display, setDisplay] = useState(false);

  const Example = ({date, view}) => {
    const handleButtonClick = () => {
        console.log('add meal');
        setDisplay(!display);
        const selectedDay = {displayDay: display, day: date}
        dispatch({type: actions.DISPLAY_DAY, payload: selectedDay});
    }

    state.recipes?.map((recipe) => console.log(`ici ${JSON.stringify(recipe)}`))


    if (state.recipes.length) {
      state.recipes.map((recipe) => console.log(recipe.generalInformation.title));
    }

    return (
      <div onClick={handleButtonClick}>
        <br/>
        add
      </div>
      );
  }
  
  const HandleClickDay = (value, event) => {

    //basicMeal.date = value;
    /*  if (basicMeal[0].date !== value.toString()) {
        console.log(`You choose the wrong day ! ${value} vs ${basicMeal[0].date}`);
        return;
      }
      state.recipes.push(basicMeal[0].recipes[0]);
      state.meals.push(basicMeal);
      */
    console.log('Hello');
    console.log(`This is the day : ${value}`);
    dispatch({ type: 'ADD_RECIPE', payload: state.recipes });
    dispatch({ type: 'ADD_MEAL', payload: state.recipes });
  };

  return (
    <div>
      <Calendar /*onClickDay={HandleClickDay}*/ tileContent={Example} tileClassName='toto' />
    </div>
  );
};

export default FoodSchedule;