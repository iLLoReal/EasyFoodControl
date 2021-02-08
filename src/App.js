import './App.css';
import Store from './Components/State/Provider/Store';
import FoodSchedule from './Components/FoodScheduler';
import Day from './Components/Day';

function App() {
  return (
    <Store>
        <FoodSchedule />
        <Day />
    </Store>
  );
}

export default App;
