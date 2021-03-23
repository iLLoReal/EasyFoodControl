import './App.css';

import Store from './Components/State/Provider/Store';
import Home from './Components/Home';

const App = () => {
  return (
    <div>
    <Store>
        <Home/>
    </Store>
    </div>
   );
}

export default App;
