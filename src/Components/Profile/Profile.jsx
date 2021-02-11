import React, { useContext } from 'react';
import { Context } from '../State/Provider/Store';

const Profile = () => {
  const [state, dispatch] = useContext(Context);
  const { auth } = state; 

   return (
   <div>
       <div>Username: {auth.username}</div>
       <div>Token: {auth.token}</div>
   </div>
  )
};

export default Profile;