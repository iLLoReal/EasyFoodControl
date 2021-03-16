import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../State/Provider/Store'
import { NavLink, Switch,  Route, useHistory, useLocation } from 'react-router-dom';
import * as actions from '../State/Reducer/Reducer.constants';
import { CSSTransition } from 'react-transition-group';

import './Nav.scss';
import './Nav.animation.css';
import AddMeal from '../Display/AddMeal';
import Profile from '../Profile/Profile';
import Recipe from '../Recipes';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ObjectivesChart from '../Calendar/ObjectivesChart';
import ObjectivesScheduler from '../Calendar/ObjectivesScheduler';



const Nav = () => {
  const [ routeChanged, setRouteChanged ] = useState(false);
  const [ prevBgType, setPrevBgType ] = useState('white');
  const nodeRef = useRef(null);
  const location = useLocation();
  location.pathname = location.pathname.toLocaleLowerCase();

  var bgType = (location.pathname === "/" ||
                        location.pathname === "/addmeal" ||
                        location.pathname === "/createrecipe") ? "white" : "black";

     useEffect(() => {
         setRouteChanged(prevBgType !== bgType);
         setPrevBgType(bgType);
      }, [location.pathname, bgType, prevBgType]);


  const isCurrent = (to) => { 
      if ((to === '/' && location.pathname === '/addmeal') ||   (to === '/addmeal' && location.pathname === '/')){
          return (true);
      }
      return (to === location.pathname)
  }
  const [state, dispatch] = useContext(Context);
  const { auth } = state;

  let history = useHistory();

  const handleLogout = () => {
    dispatch({type: actions.LOGOUT, payload: []});
    history.push("/");
  };

  return auth.token ? (
    <div>
      <nav className={bgType}>
      <CSSTransition
      in={routeChanged}
      nodeRef={nodeRef}
      classNames={bgType}
      timeout={6000}
      onEnter={() => setRouteChanged(false)}
      >
        <ul ref={nodeRef}>
            <li><NavLink to={'/AddMeal'} activeClassName={"white-nav-title"}><span className={isCurrent("/") ? "current-white" : ""}>Add Meal</span></NavLink></li><span className='menu-dot'>.</span>
            <li><NavLink to={'/Profile'} activeClassName={"black-nav-title"}><span className={isCurrent("/profile") ? "current-black" : ""}>Profile</span></NavLink></li><span className='menu-dot'>.</span>
            <li><NavLink to={'/CreateRecipe'} activeClassName={"white-nav-title"}><span className={isCurrent("/createrecipe") ? "current-white" : ""}>Create a recipe</span></NavLink></li><span className='menu-dot'>.</span>
            <li><NavLink to={'/Objectives'} activeClassName={"black-nav-title"}><span className={isCurrent("/objectives") ? "current-black" : ""}>Setup Objectives</span></NavLink></li><span className='menu-dot'>.</span>
            <li><NavLink to={'/Login'} activeClassName={"white-nav-title"} onClick={handleLogout}><span className={isCurrent("/login") ? "current-white" : ""}>Logout</span></NavLink></li>
        </ul>
    </CSSTransition>
    </nav>
    <Switch>
      <Route path='/addmeal' exact component={AddMeal}/>
      <Route path='/profile' exact component={Profile}/>
      <Route path='/createrecipe' exact component={Recipe}/>
      <Route path='/objectives' exact component={ObjectivesScheduler}/>
      <Route path='/objectiveschart' exact component={ObjectivesChart}/>
      <Route path='/logout' exact component={Login}/>
    </Switch>
   </div>
  ) : (
    <div>
     <nav className={bgType}>

    <CSSTransition
    in={routeChanged}
    nodeRef={nodeRef}
    classNames={bgType}
    timeout={6000}
    onEnter={() => setRouteChanged(false)}
    >
        <ul ref={nodeRef}>
            <li><NavLink to={'/createRecipe'} activeClassName={"white-nav-title"}><span className={isCurrent("/createrecipe") ? "current-white" : ""}>Create a recipe</span></NavLink></li><span className='menu-dot'>.</span>
            <li><NavLink to={'/Login'} activeClassName={"white-nav-title"}><span className={isCurrent("/login") ? "current-black" : ""}>Login</span></NavLink></li>
        </ul>
    </CSSTransition>
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