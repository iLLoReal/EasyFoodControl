import React, { useContext, useEffect, useReducer, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './Day.css';

import Objectives from './Objectives';

import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants'

const ObjectivesScheduler = () => {
  const [state, dispatch] = useContext(Context);
  const [display, setDisplay] = useState(false);
  const [selectedDay, setSelectedDay] = useState({display: false, day: 'none'})

  const isInRange = (date) => {
    const curDate = date.getTime();
    const from = state.selectedDate?.startingDate.getTime();
    const to = state.selectedDate?.endingDate.getTime();
    return (curDate >= from && curDate <= to);
  }

  const DisplayCalories = (gDate) => {
    //console.log(state.selectedDay.day)
    let calories = 0;
    for (let mealsIndex = 0; mealsIndex < state.meals.length; mealsIndex++) {
      if (state.meals[mealsIndex].day.toString() === gDate.gDate) {
        for (let recipesIndex = 0; recipesIndex < state.meals[mealsIndex].recipes.length; recipesIndex++) {
          for (let ingredsIndex = 0; ingredsIndex < state.meals[mealsIndex].recipes[recipesIndex].ingredients.length; ingredsIndex++) {
              calories += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].calorie, 10);
              console.log('found it');
          }
        }
      }
      else
        console.log(gDate.gDate);
    }
    return (
      <div>
        {calories}
      </div>
    );
  };
  

  const Tiles = ({date, view}) => {
    const handleButtonClick = () => {
        //  selectedDate: {stage: 'none', startingDate: null, endingDate: null},

        switch(state.selectedDate?.stage) {
            case 'none':
                break;
            case 'start':
                dispatch({type: actions.SET_RANGE, payload: {...state.selectedDate, startingDate: date}})
                break;
            case 'end':
                dispatch({type: actions.SET_RANGE, payload: {...state.selectedDate, stage: 'finished', endingDate: date}})
                break;
            case 'finished':
                //A voir
                break;
            default:
                break;
        }
        //dispatch({type: actions.DISPLAY_DAY, payload: selectedDayConst});
    }

    return (
      <div onClick={handleButtonClick}>
        <br />
        {(state.selectedDate?.stage === 'finished' && isInRange(date)) ? (<DisplayCalories gDate={date.toString()}/>) : 'Out of Range'}
      </div>
      );
  }

  return (
    <div style={{margin: 'auto'}}>
      <Calendar onClickDay={Tiles.handleButtonClick} tileContent={Tiles} tileClassName='toto' />
      <Objectives />
    </div>
  );
};

export default ObjectivesScheduler;