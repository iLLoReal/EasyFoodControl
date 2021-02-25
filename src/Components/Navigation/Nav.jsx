import { useContext, useEffect } from 'react';
import { Context } from '../State/Provider/Store'
import { NavLink, Switch,  Route, useHistory } from 'react-router-dom';
import * as actions from '../State/Reducer/Reducer.constants';

import AddMeal from '../Display/AddMeal';
import Profile from '../Profile/Profile';
import Recipe from '../Recipes';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ObjectivesScheduler from '../Calendar/ObjectivesScheduler';


const Nav = () => {
  const [state, dispatch] = useContext(Context);
  const { auth } = state;

  let history = useHistory();

  const handleLogout = () => {
    dispatch({type: actions.LOGOUT, payload: []});
    history.push("/");
  };

  return auth.token ? (
    <div>
    <nav>
      <ul>
        <li><NavLink to={'/AddMeal'}>Add Meal</NavLink></li>
        <li><NavLink to={'/Profile'}>Profile</NavLink></li>
        <li><NavLink to={'/CreateRecipe'}>Create a recipe</NavLink></li>
        <li><NavLink to={'/Objectives'}>Setup Objectives</NavLink></li>
        <li><NavLink to={'/Login'} onClick={handleLogout}>Logout</NavLink></li>
      </ul>
    </nav>
    <button onClick={handleLogout}>LOGOUT</button>
    <Switch>
      <Route path='/AddMeal' exact component={AddMeal}/>
      <Route path='/Profile' exact component={Profile}/>
      <Route path='/CreateRecipe' exact component={Recipe}/>
      <Route path='/Objectives' exact component={ObjectivesScheduler}/>
      <Route path='/Logout' exact component={Login}/>
    </Switch>
   </div>
  ) : (
    <div>
    <nav>
      <ul>
        <li><NavLink to={'/Login'}>Login</NavLink></li>
        <li><NavLink to={'/createRecipe'}>Create recipe</NavLink></li>
      </ul>
    </nav>
    <Switch>
      <Route path='/' exact component={Login}/>
      <Route path='/Login' exact component={Login}/>
      <Route path='/Register' exact component={Register}/>
      <Route path='/createRecipe' exact component={Recipe}/>
    </Switch>
   </div>
  );
}

export default Nav;