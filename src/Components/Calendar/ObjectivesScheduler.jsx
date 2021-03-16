import React, { useContext, useState } from 'react';
import {useHistory} from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './Day.css';

import Objectives from './Objectives';

import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants'

const ObjectivesScheduler = () => {
  const [state, dispatch] = useContext(Context);
  const [result, setResult] = useState();
  const [calorieBalance, setCalorieBalance] = useState(0);
  const history = useHistory();

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
  const treatAsUTC = (date) => {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  const daysBetween = (startDate, endDate) => {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
  }

  const getStyle = (percentage, recommended, margin) => {
    let style = '#8CC152';

    if (percentage > recommended){
      style = (percentage > (recommended + margin)) ? 'red' : 'orange';
    }
    else if (percentage < recommended) {
      style = (percentage < recommended - margin) ? 'red' : 'purple';
    }
    return (style);
  }

  const getCalorieBalance = (date) => {
    const lipidsRecommended = 35;
    const carbsRecommended = 50;
    const proteinsRecommended = 15;
    const nutrimentsMarginPermitted = 15;
    
    let totalCalories = 0;
    let totalNutriments = {lipids: '', carbs: '', proteins: ''};
    let bufferNutriments = {lipids: 0, carbs: 0, proteins: 0};
    let bufferBalanceJourney = [];

    let numberOfDays =  parseInt(daysBetween(state.selectedDate.startingDate, date)) + 1;

    for (let mealsIndex = 0; mealsIndex < state.meals.length; mealsIndex++) {
      if (isInRange(state.meals[mealsIndex].day) && isBefore(state.meals[mealsIndex].day, date)) {
        let currentTotal = {totalCalorie: 0, lipids: 0, carbs: 0, proteins: 0, date: state.meals[mealsIndex].day};
        for (let recipesIndex = 0; recipesIndex < state.meals[mealsIndex].recipes.length; recipesIndex++) {
          for (let ingredsIndex = 0; ingredsIndex < state.meals[mealsIndex].recipes[recipesIndex].ingredients.length; ingredsIndex++) {
              let currentCalorie = state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].calorie;
              let currentLipids = state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].nutriments.lipids;
              let currentCarbs = state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].nutriments.carbs;
              let currentProteins = state.meals[mealsIndex].recipes[recipesIndex].ingredients[ingredsIndex].nutriments.proteins;

              currentTotal.totalCalorie += parseInt(currentCalorie);
              currentTotal.lipids += parseInt(currentLipids);
              currentTotal.carbs += parseInt(currentCarbs);
              currentTotal.proteins += parseInt(currentProteins);

              totalCalories += parseInt(currentCalorie);
              bufferNutriments.lipids += currentTotal.lipids;
              bufferNutriments.carbs += currentTotal.carbs;
              bufferNutriments.proteins += currentTotal.proteins;
          }
        }
        let percentage = currentTotal.lipids + currentTotal.carbs + currentTotal.proteins;
        if (!percentage)
          percentage = 1;
        bufferBalanceJourney.push({
          totalCalorie: currentTotal.totalCalorie,
          lipids: Math.round((currentTotal.lipids / percentage * 100)),
          carbs: Math.round((currentTotal.carbs / percentage * 100)),
          proteins: Math.round((currentTotal.proteins / percentage * 100)),
          date: currentTotal.date
        });
      }
    }

    let totalCalorieBalance = {
      value: Math.round(totalCalories/numberOfDays),
      style: getStyle((((totalCalories/numberOfDays) / state.objectives.calories) * 100), 100, nutrimentsMarginPermitted)
    };
  
    let percentage = bufferNutriments.lipids + bufferNutriments.carbs + bufferNutriments.proteins;
    if (!percentage)
      percentage = 1;
    totalNutriments = {...bufferNutriments};
    totalNutriments.balance = {
      lipidsTotal: totalNutriments.lipids,
      lipidBalance: (totalNutriments.lipids/numberOfDays) + 'g',
      lipidBalanceTotal: {value: Math.round((totalNutriments.lipids/percentage * 100)) + '%', style: getStyle((totalNutriments.lipids/percentage * 100), lipidsRecommended, nutrimentsMarginPermitted)},
      carbsTotal: totalNutriments.carbs,
      carbsBalance: (totalNutriments.carbs/numberOfDays) + 'g',
      carbsBalanceTotal: {value: Math.round((totalNutriments.carbs/percentage * 100)) + '%', style: getStyle((totalNutriments.carbs/percentage * 100), carbsRecommended, nutrimentsMarginPermitted)},
      proteinTotal: totalNutriments.proteins,
      proteinBalance: (totalNutriments.proteins/numberOfDays) + 'g',
      proteinBalanceTotal: {value: Math.round((totalNutriments.proteins/percentage * 100)) + '%', style: getStyle((totalNutriments.proteins/percentage * 100), proteinsRecommended, nutrimentsMarginPermitted)}
    };
    setCalorieBalance({date: date, calorieBalance: {...totalCalorieBalance}, nutrimentBalance: {...totalNutriments.balance}});

    setResult({date: date, calorieBalance: {...totalCalorieBalance}, nutrimentBalance: {...totalNutriments.balance}, balanceJourney: bufferBalanceJourney})
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

  const showGraph = () => {
    dispatch({type: actions.SET_RESULT, payload: result});
    history.push('/ObjectivesChart')
  }

  const DisplayCalories = (gDate) => {
    const lipidsPercent = '35%';
    const carbsPercent = '50%';
    const proteinsPercent = '15%';

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
      <div style={{color: 'black', backgroundColor: 'yellow', borderRadius: 8}}>
        {calories}/{state.objectives.calories}
        <div>
          {gDate.gDate.toString() === calorieBalance?.date?.toString() && 
          (<div><b>{`(${displayDate(gDate.gDate, state.selectedDate.startingDate)} -> \
          ${displayDate(state.selectedDate.startingDate, gDate.gDate)}`}
           : calories in average = [<span style={{color: calorieBalance.calorieBalance.style}}>{`${calorieBalance.calorieBalance.value}`}</span>{`/${state.objectives.calories}`}],
           [lipids: <span style={{color: calorieBalance.nutrimentBalance.lipidBalanceTotal.style}}>{`${calorieBalance.nutrimentBalance.lipidBalanceTotal.value}`}</span>{lipidsPercent}<br/>
            carbs: <span style={{color: calorieBalance.nutrimentBalance.carbsBalanceTotal.style}}>{`${calorieBalance.nutrimentBalance.carbsBalanceTotal.value}`}</span>{carbsPercent}<br/>
            proteins: <span style={{color: calorieBalance.nutrimentBalance.proteinBalanceTotal.style}}>{`${calorieBalance.nutrimentBalance.proteinBalanceTotal.value}`}</span>{proteinsPercent}
            ]</b>
          <br/><span styles={{textDecoration: 'underline'}} onClick={showGraph}>Show graph</span>
          </div>)}
        </div>
      </div>
    );
  };
  

  const Tiles = ({date, view}) => {
    const handleButtonClick = () => {
 
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
    }

    return (
      <div onClick={handleButtonClick}>
        <br />
        {(state.selectedDate?.stage === 'finished' && isInRange(date)) ? 
        (<DisplayCalories gDate={date}/>) : 
        ''}
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