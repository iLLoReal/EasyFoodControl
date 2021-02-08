import React, { createContext, useReducer } from 'react';
import Reducer from '../Reducer/Reducer';

const initialState = {
  auth: [],
  meals: [],
  recipes: [],
  selectedDay: {displayDay: false, day: ''},
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