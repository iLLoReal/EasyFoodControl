import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const RegisterApiCalls = {
  registerUser: async (login, password, email) => {
    const data = {
      login: login,
      email: email,
      password: password,
    }
    const registerResponse = await ApiMethods.getPostResultAlpha(routes.registerRoute, data);
    if (registerResponse?.data !== undefined) {
      return registerResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(registerResponse));
    return null;
  }
}
export default RegisterApiCalls;