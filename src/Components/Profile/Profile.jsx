import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Context } from '../State/Provider/Store';
import axios from 'axios';

import * as actions from '../State/Reducer/Reducer.constants';
import LoginApiCalls from '../Api/LoginApiCalls';

const Profile = () => {
  const [state, dispatch] = useContext(Context);
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { auth } = state;
  let history = useHistory();

  //if token valid (check from server) :
  const authDecoded = jwt_decode(auth);
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

  const handleSetNewPassword = (e) => {
    setNewPassword(e.target.value.toString());
  }

  const handleChangePassword = (e) => {
    setChangePassword(true);
  }

  const changePasswordValidate = async (e) => {
    const newUser = {
      login: authDecoded.login,
      email: authDecoded.email,
      password: password,
      newPassword: newPassword,
      token: auth
    };

    const result = await LoginApiCalls.changePassword(newUser);
    if (result) {
      console.log(`Ici on a result ${JSON.stringify(result)}`);
      dispatch({ type: actions.LOGIN, payload: result.token });
    } else {
      console.log('Cancelling modify...');
      return ;
    }
    setChangePassword(false);
    history.push('/profile');
  }

  const modifyUserValidate = async () => {
    const newUser = {
      login: login,
      email: email,
      password: password,
      token: auth
    };

    const result = await LoginApiCalls.modifyUser(newUser);
    if (result) {
      console.log(`Ici on a result ${JSON.stringify(result)}`);
      dispatch({ type: actions.LOGIN, payload: result.token });
    } else {
      console.log('Cancelling modify...');
      return ;
    }
    setShowInputs(false);
    history.push('/profile');
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
        <button onClick={handleChangePassword}>
          Change password
        </button>
      </div>
      {changePassword && !showInputs && (
      <div>
        <form>
          <div>
            <label>Enter password again</label>
            <input type='Password' placeholder='current password' onChange={handlePassword} />
          </div>
          <div>
            <label>Enter new password</label>
            <input type='Password' placeholder='new password' onChange={handleSetNewPassword} />
          </div>
        </form> 
        <button onClick={changePasswordValidate}>Confirm changes</button>
        <button onClick={() => setChangePassword(!changePassword)}>Cancel</button>
        </div>
        )}

      {showInputs && (
        <div>
          <form>
            <div>
              <label>New Login (current : )</label>
              <input type='text' placeholder='new login' onChange={handleLogin} />
            </div>
            <div>
              <label>Enter password again</label>
              <input type='Password' placeholder='current password' onChange={handlePassword} />
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