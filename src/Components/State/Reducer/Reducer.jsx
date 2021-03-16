import  * as actions from './Reducer.constants.jsx';
import { initialState } from '../Provider/Store';

const Reducer = (state, action) => {
   switch (action.type) {
     case actions.LOGIN:
       return {
         ...state,
         auth: action.payload,
       };
     case actions.LOGOUT:
       return {
         ...initialState,
       }
     case actions.ADD_RECIPE:
       return {
         ...state,
         recipes: action.payload,
       };
     case actions.ADD_MEAL:
       return {
         ...state,
         meals: action.payload,
       };
     case actions.DISPLAY_DAY:
       return {
         ...state,
         selectedDay: action.payload,
       };
     case actions.SET_RANGE:
       return {
         ...state,
         selectedDate: action.payload,
       };
     case actions.SET_RESULT:
       return {
         ...state,
         result: action.payload,
       }
     case actions.SET_OBJECTIVES:
       return {
         ...state,
         objectives: action.payload,
       };
     case actions.SET_MEASUREMENTS:
       return {
          ...state,
          measurements: action.payload,
       };
      default:
       return state;
   }
  };

export default Reducer;