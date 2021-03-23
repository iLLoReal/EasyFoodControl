import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const RegisterApiCalls = {
  registerUser: async (login, password, email) => {
    const registerResponse = await ApiMethods.getPostResultAlpha(
        routes.registerRoute,
          {
             login: login,
             password: password,
             email: email,
          });
    if (registerResponse.data !== undefined) {
      return registerResponse.data;
    }
    else {
      console.log(ApiMethods.getErrorResponse(registerResponse));
      return null;
    }
  }
}
export default RegisterApiCalls;