import React, { useState, useContext, useEffect } from 'react';

import axios from 'axios';

import { Context } from '../State/Provider/Store';

import {weekday, month} from './Day';
import * as actions from '../State/Reducer/Reducer.constants';
import { useHistory } from 'react-router-dom';

export const isNum = (val) => (/^\d+$/.test(val));

const Objectives = () => {
  const objectivesInitialState = {
    calories: 2800,
    weight: 80,
    startingDate: null,
    endingDate: null
  }
  const measurementsInitialState = {
    weight: 80,
    height: 180,
    age: 30,
  }

  const [state, dispatch] = useContext(Context);
  const [objectives, setObjectives] = useState(objectivesInitialState);
  const history = useHistory();
  const [measurements, setMeasurements] = useState(measurementsInitialState);
  const [activity, setActivity] = useState('Sedentary');
  const [gender, setGender] = useState('Male');
  const setMeasurementsRoute = 'http://localhost:3000/user/setMeasurements';
  const setObjectivesRoute = 'http://localhost:3000/user/setObjectives';

  useEffect(() => {
    setObjectives({...state.objectives});
    setMeasurements({...state.measurements});
  },[state.objectives, state.measurements])

  const handleDispatchObjectives = async () => {
    if (!objectives.calories || !isNum(objectives.calories)) {
      setObjectives({...objectives, calories: GetCalories('Oxford')})
    }

    if (!objectives.weight || !isNum(objectives.weight)) {
      setObjectives({...objectives, weight: measurements.weight ? measurements.weight : 80})
    }

    const sendObjectives = async () => { 
      try {
          await axios.post(
          setObjectivesRoute,
          {
            token: state.auth.token,
            objective: objectives
          }
        )
          return true;
     } catch(err) {
        console.log(err);
        return false;
      }
    }

    const sendMeasurements = async () => { 
      try {
          await axios.post(
          setMeasurementsRoute, 
          {
            token: state.auth.token,
            measurements: measurements,
          }
        );
          return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }

    const measurementsAxiosResult = await sendMeasurements();
    if (measurementsAxiosResult) {
      dispatch({type: actions.SET_MEASUREMENTS, payload: {...measurements}});
    }

    const objectivesAxiosResult = await sendObjectives();
    if (objectivesAxiosResult) {
      dispatch({type: actions.SET_OBJECTIVES, payload: {...objectives}});
    }
  };

  const handleSetActivity = (e) => {
    setActivity(e.target.value);
  }

  const handleSetGender = (e) => {
    setGender(e.target.value);
  }

  const GetCalories = (Method) => {
    let sportFactor = 1.2;
    const genderFactor = {
      weightFactor: gender === 'Male' ? 13.707 : 9.740,
      heightFactor: gender === 'Male' ? 492.3 : 172.9,
      ageFactor: gender === 'Male' ? 6.673 : 4.737,
      added: gender === 'Male' ? 77.607 : 667.051
    };

    switch (activity) {
      case 'Sedentary':
        sportFactor = 1.2;
        break;
      case 'Low activity':
        sportFactor = 1.375;
        break;
      case 'Medium activity':
        sportFactor = 1.55;
        break;
      case 'Intense activity':
        sportFactor = 1.725;
        break;
      default:
        sportFactor = 1.2;
        break;
    }
    const OxfordCalories = (14.2 * measurements.weight + 593) * sportFactor;
    const BenedictAndHarrisCalories = ((genderFactor.weightFactor * measurements.weight)
       + (genderFactor.heightFactor * (measurements.height / 100))
       - (genderFactor.ageFactor * measurements.age)
       + (genderFactor.added)
       ) * sportFactor;

       if (Method === 'Oxford')
      return OxfordCalories;
    return BenedictAndHarrisCalories;
  }

  const handleSelectStartingDate = () => {
    dispatch({type: actions.SET_RANGE, payload: {...state.selectedDate, stage: 'start'}})
  };

  const handleSelectEndingDate = () => {
    dispatch({type: actions.SET_RANGE, payload: {...state.selectedDate, stage: 'end'}})
  };
  
  const handleSelectDateAuto = () => {
    const newSelectedDate = {
      stage: 'finished',
      startingDate: new Date(),
      endingDate: new Date()
    };
    if (state.selectedDate?.startingDate?.getTime()) {
      newSelectedDate.startingDate = new Date(state.selectedDate.startingDate);
    }

    const fullYear = newSelectedDate?.startingDate?.getFullYear();
    const months = newSelectedDate?.startingDate?.getMonth() + ((measurements.weight - objectives.weight) / 2);
    const days = newSelectedDate?.startingDate?.getDate() + ((measurements.weight - objectives.weight) % 2 ? 15 : 0);

    newSelectedDate.endingDate = new Date(fullYear, months, days);
    dispatch({type: actions.SET_RANGE, payload: {...newSelectedDate}});
  }

  const handleConfirmDate = () => {
    setObjectives({...objectives, startingDate: state.selectedDate.startingDate, endingDate: state.selectedDate.endingDate});
  }

  const handleCalorieObjective = (e) => {
    if (isNum(e.target.value))
      setObjectives({...objectives, calories: e.target.value})
    else if (e.target.value === '')
      setObjectives({...objectives, calories: GetCalories('Oxford')});
  };

  const handleWeightObjective = (e) => {
    if (isNum(e.target.value))
      setObjectives({...objectives, weight: e.target.value});
    else
      setObjectives({...objectives, weight: measurements?.weight ? measurements.weight : measurementsInitialState.calories});
  };

  const handleMeasurementsAge = (e) => {
    setMeasurements({...measurements, age: (isNum(e.target.value) ? e.target.value : 30)});
  };
  const handleMeasurementsHeight = (e) => {
    setMeasurements({...measurements, height: (isNum(e.target.value) ? e.target.value : 180)});
  };
  const handleMeasurementsWeight = (e) => {
    setMeasurements({...measurements, weight: isNum(e.target.value) ? e.target.value : 80});
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {state.objectives.startingDate && (
      <div>
        <button onClick={() => history.push('/ObjectivesChart')}>Consult objectives stats</button>
      </div>)}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h4>Type in current measures</h4>
        <form style={{textAlign: 'right'}}>
          <label>
            weight :
            <input type="text" placeholder={measurements.weight} onChange={handleMeasurementsWeight}/>
            <br/>
          </label>
          <label>
            height :
            <input type="text" placeholder={measurements.height} onChange={handleMeasurementsHeight}/>
            <br/>
          </label>
          <label>
            age :
            <input type="text" placeholder={measurements.age} onChange={handleMeasurementsAge}/>
            <br/>
          </label>
          <div style={{textAlign: 'left'}}>
          Gender :
          <select onChange={handleSetGender} selected={'Male'}>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
          </div>
          <div style={{textAlign: 'left'}}>
            sports :
          <select onChange={handleSetActivity} selected={'Sedentary'}>
            <option value={'Sedentary'}>Sedentary</option>
            <option value={'Low activity'}>Low activity</option>
            <option value={'Medium activity'}>Medium activity</option>
            <option value={'Intense activity'}>Intense activity</option>
          </select>
          </div>
        </form>
      </div>
      <h3>Setup your goals !</h3>
      <h4>Select a date range</h4>
          Click on Start then click on a day of the calendar, then repeat with End to choose an ending date
          <div style={{flex: 1, flexDirection: 'row'}}>
            <button onClick={handleSelectStartingDate}>Start</button>
            <button onClick={handleSelectEndingDate}>End</button>
            <button onClick={handleSelectDateAuto}>Choose for me</button>

            {state.selectedDate.stage === 'finished' && <button onClick={handleConfirmDate}>Confirm</button>}
          </div>
          <div>
            <h3>
              Starting date : {`${weekday[state.selectedDate.startingDate?.getDay()]}
              ${month[state.selectedDate.startingDate?.getMonth()]}
              ${state.selectedDate.startingDate?.getDate()}`}
            </h3>
            <h3>
              Ending date : {`${weekday[state.selectedDate?.endingDate?.getDay()]}
              ${month[state.selectedDate?.endingDate?.getMonth()]}
              ${state.selectedDate?.endingDate?.getDate()}`}
            </h3>
          </div>
       <span>Calories (leave blank for Oxford) :<input type='text' placeholder={objectives.calories} onChange={handleCalorieObjective}/></span><br/>
       <span>Weight (leave blank for keeping current weight) :<input type='text' placeholder={objectives.weight} onChange={handleWeightObjective}/></span><br/>
      <div style={{textAlign: 'left'}}>
        <span>Recommended : </span><br/>
      </div>
      <div style={{textAlign: 'right'}}>
        <span>Benedict and Harris:<b> {parseInt(GetCalories('Benedict'))}</b></span><br/>
        <span>Oxford: <b>{parseInt(GetCalories('Oxford'))}</b></span>
      </div>
      <span>
        <button onClick={handleDispatchObjectives}>Submit objectives</button>
      </span>
    </div>
  )
};

export default Objectives;