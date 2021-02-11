import './App.css';

import Store from './Components/State/Provider/Store';
import Home from './Components/Home';

const App = () => {
  return (
    <Store>
      <Home/>
    </Store>
  );
}

export default App;
