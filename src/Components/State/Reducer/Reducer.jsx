import  * as actions from './Reducer.constants.jsx';

const Reducer = (state, action) => {
   switch (action.type) {
     case actions.LOGIN:
       return {
         ...state,
         auth: action.payload,
       };
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
       }
     default:
       return state;
   }
  };

export default Reducer;