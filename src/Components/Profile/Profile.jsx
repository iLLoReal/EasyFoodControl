import React, { useContext, useState} from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Context } from '../State/Provider/Store';
import axios from 'axios';
import * as actions from '../State/Reducer/Reducer.constants';

const Profile = () => {
  const [state, dispatch] = useContext(Context);
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const modifyUserRoute = 'http://localhost:3000/user/modify';
  const { auth } = state;
  let history = useHistory();

  //if token valid (check from server) :
  const authDecoded = jwt_decode(auth.token);
  const styles = {
    container: {
      border: '1px solid black',
      display: 'table',
      verticalAlign: 'middle',
      height: 'auto',
      margin: '10vw',
    },
  }

  const handleModifyProfile = () => {
    setShowInputs(!showInputs);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value.toString());
  }

  const handleLogin = (e) => {
    setLogin(e.target.value.toString());
  }

  const handlePassword = (e) => {
    setPassword(e.target.value.toString());
  }

  const modifyUserValidate = async () => {
    const modifyUser = async (token) => {
      try {
        const result = await axios.post(
          modifyUserRoute,
          {
            login: login,
            email: email,
            password: password,
            token: auth.token
          }
        );
        return result;
      }
      catch(error) {
        console.log(error);
      }
    }
    const result = await modifyUser();
    await dispatch({type: actions.LOGIN, payload: result.data.token});
    history.push('/Login');
  }

   return (
   <div style={styles.container}>
      <div>
         Username: <span >{authDecoded.login}</span>
      </div>
      <div>
         Mail: {authDecoded.email}
      </div>
      <div>
        <button onClick={handleModifyProfile}>
          Modify profile
        </button>
      </div>
      {showInputs && (
        <div>
          <form>
            <div>
              <label>New Login (current : )</label>
              <input type='text' placeholder='new login' onChange={handleLogin}/>
            </div>
            <div>
              <label>New Email (current : )</label>
              <input type='text' placeholder='new email' onChange={handleEmail}/>
            </div>
            <div>
              <label>Enter password again</label>
              <input type='Password' placeholder='current password' onChange={handlePassword}/>
            </div>
          </form>
          <button onClick={modifyUserValidate}>Confirm changes</button>
          <button onClick={() => setShowInputs(!showInputs)}>Cancel</button>
        </div>
      )}
   </div>
  )
};

export default Profile;