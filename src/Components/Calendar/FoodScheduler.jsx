import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './Day.css';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants'



const FoodSchedule = () => {
  const [state, dispatch] = useContext(Context);
  const [display, setDisplay] = useState(false);
  const [selectedDay, setSelectedDay] = useState({display: false, day: 'none'})

    const isInRange = (date) => {
      const curDate = date.getTime();
      const from = state.selectedDate?.startingDate?.getTime();
      const to = state.selectedDate?.endingDate?.getTime();
      return (curDate >= from && curDate <= to);
    }

  const DisplayRecipes = (gDate) => {
    let recipes = '';
    let calories = 0;

    for (let mealsIndex = 0; mealsIndex < state.meals.length; mealsIndex++) {
      if (state.meals[mealsIndex].day.toString() === gDate.gDate.toString()) {
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
        {calories}{isInRange(gDate.gDate) ? `/${state.objectives.calories}` : null}
        {recipes}
      </div>
    );
  };
  

  const Scheduler = ({date, view}) => {
    const handleButtonClick = () => {
        setDisplay(true);
        const selectedDayConst = {displayDay: display, day: date};
        setSelectedDay({...selectedDayConst})
        dispatch({type: actions.DISPLAY_DAY, payload: selectedDayConst});
    }

    const dateToString = date.toString();
    return (
      <div onClick={handleButtonClick}>
        <br/>
        {dateToString === state.selectedDay.day.toString() && state.selectedDay.displayDay ? 'Create or choose recipe' : 'add'}  
        <DisplayRecipes gDate={date}/>
      </div>
      );
  }

  return (
    <div style={{margin: 'auto'}}>
      <Calendar onClickDay={Scheduler.handleButtonClick} tileContent={Scheduler} tileClassName='curTile' />
    </div>
  );
};

export default FoodSchedule;