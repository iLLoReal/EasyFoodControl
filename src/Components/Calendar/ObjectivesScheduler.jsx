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
  const [calorieBalance, setCalorieBalance] = useState(0);
  const [nutrimentBalance, setNutrimentBalance] = useState({});

  const isInRange = (date) => {
    const curDate = date.getTime();
    const from = state.selectedDate?.startingDate.getTime();
    const to = state.selectedDate?.endingDate.getTime();
    return (curDate >= from && curDate <= to);
  }

  const isBefore = (date, to) => {
    const curDate = date.getTime();
    const dateTo = to.getTime();
    return curDate <= dateTo;
  }
  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
  }

  const getCalorieBalance = (date) => {
    let totalCalories = 0;
    let totalNutriments = {lipids: '', carbs: '', proteins: ''};
    let buffer = {lipids: 0, carbs: 0, proteins: 0};

    let numberOfDays =  parseInt(daysBetween(state.selectedDate.startingDate, date)) + 1;

    for (let mealsIndex = 0; mealsIndex < state.meals.length; mealsIndex++) {
      if (isInRange(state.meals[mealsIndex].day) && isBefore(state.meals[mealsIndex].day, date)) {
        for (let recipesIndex = 0; recipesIndex < state.meals[mealsIndex].recipes.length; recipesIndex++) {
          for (let ingredsIndex = 0; ingredsIndex < state.meals[mealsIndex].recipes[recipesIndex].ingredients.length; ingredsIndex++) {
              totalCalories += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].calorie, 10);
              buffer.lipids += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].nutriments.lipids);
              buffer.carbs += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].nutriments.carbs);
              buffer.proteins += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].nutriments.proteins);
          }
        }
      }
    }
    totalNutriments = {...buffer};
    totalNutriments.balance = {
       lipidBalance: (totalNutriments.lipids/numberOfDays) + 'g',
       carbsBalance: (totalNutriments.carbs/numberOfDays) + 'g',
       proteinBalance: (totalNutriments.proteins/numberOfDays) + 'g'
    };
    console.log(totalNutriments.balance);
    setCalorieBalance({date: date, calorieBalance: (totalCalories/numberOfDays), nutrimentBalance: {...totalNutriments.balance}});
  }

  const displayDate = (curDate, startingDate) => {
    let date = ``;
    if (curDate.getMonth().toString() !== startingDate.getMonth().toString() || curDate.getFullYear().toString() !== startingDate.getFullYear().toString())
      date = `${startingDate.getMonth() + 1}/`;
    date += `${startingDate.getDate()}`;
    if (curDate.getFullYear().toString() !== startingDate.getFullYear().toString())
      date += `/${startingDate.getFullYear()}`;
    return date;
  }

  const DisplayCalories = (gDate) => {
    //console.log(state.selectedDay.day)
    let calories = 0;
    for (let mealsIndex = 0; mealsIndex < state.meals.length; mealsIndex++) {
      if (state.meals[mealsIndex].day.toString() === gDate.gDate.toString()) {
        for (let recipesIndex = 0; recipesIndex < state.meals[mealsIndex].recipes.length; recipesIndex++) {
          for (let ingredsIndex = 0; ingredsIndex < state.meals[mealsIndex].recipes[recipesIndex].ingredients.length; ingredsIndex++) {
              calories += parseInt(state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].calorie, 10);
              
          }
        }
      }
    }
    return (
      <div style={{color: 'black'}}>
        {calories}/{state.objectives.calories}
        <div>
          {gDate.gDate.toString() === calorieBalance?.date?.toString() && 
          (<b>{`(${displayDate(gDate.gDate, state.selectedDate.startingDate)} -> \
          ${displayDate(state.selectedDate.startingDate, gDate.gDate)} : calories in average = [${calorieBalance.calorieBalance}], nutriments in average =\
           [${calorieBalance.nutrimentBalance.lipidBalance}\
            ${calorieBalance.nutrimentBalance.carbsBalance}\
            ${calorieBalance.nutrimentBalance.proteinBalance}]`}</b>)}
        </div>
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
                if (isInRange(date))
                  getCalorieBalance(date);
                break;
            default:
                break;
        }
        //dispatch({type: actions.DISPLAY_DAY, payload: selectedDayConst});
    }

    return (
      <div onClick={handleButtonClick}>
        <br />
        {(state.selectedDate?.stage === 'finished' && isInRange(date)) ? 
        (<DisplayCalories gDate={date}/>) : 
        'Out of Range'}
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