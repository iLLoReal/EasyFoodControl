import React, { createContext, useReducer } from 'react';
import Reducer from '../Reducer/Reducer';

export const initialState = {
  auth: [],
  meals: [],
  recipes: [],
  selectedDay: {displayDay: false, day: ''},
  selectedDate: {stage: 'none', startingDate: null, endingDate: null},
  objectives: {calories: 2800, weight: 80, startingDate: null, endingDate: null},
  measurements: {weight: 80, height: 180, age: 30},
  result: [],
};

const Store = ({ children }) => {
   const [state, dispatch] = useReducer(Reducer, initialState);

   console.log(state);
   return (
     <Context.Provider value={[state, dispatch]}>
       {children}
     </Context.Provider>
   );
};

export const Context = createContext(initialState);

export default Store;