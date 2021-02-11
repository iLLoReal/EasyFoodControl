import { useContext, useEffect } from 'react';
import { Context } from '../State/Provider/Store'
import { NavLink, Switch,  Route, useHistory } from 'react-router-dom';
import * as actions from '../State/Reducer/Reducer.constants';

import AddMeal from '../Display/AddMeal';
import Profile from '../Profile/Profile';
import Recipe from '../Recipes';

const Nav = () => {
  const [state, dispatch] = useContext(Context);
  let history = useHistory();

  const handleLogout = () => {
    dispatch({type: actions.LOGOUT, payload: []});
    history.push("/");
  };
  
  return  (
    <div>
      <nav>
        <ul>
          <li><NavLink to={'/AddMeal'}>Add Meal</NavLink></li>
          <li><NavLink to={'/Profile'}>Profile</NavLink></li>
          <li><NavLink to={'/createRecipe'}>Create a recipe</NavLink></li>
        </ul>
      </nav>
      <button onClick={handleLogout}>LOGOUT</button>
      <Switch>
        <Route path='/AddMeal' exact component={AddMeal}/>
        <Route path='/Profile' exact component={Profile}/>
        <Route path='/createRecipe' exact component={Recipe}/>
      </Switch>
     </div>
    )
}

export default Nav;