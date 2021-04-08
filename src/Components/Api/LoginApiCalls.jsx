import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const LoginApiCalls = {
  getLoginToken: async (login, password, email) => {
    const data = {
      login: login,
      email: email,
      password: password,
    };

    const authResponse = await ApiMethods.getPostResultAlpha(routes.loginRoute, data, null)
    if (authResponse.data) {
      const token = authResponse.data.token;
      return token;
    }
    console.log(ApiMethods.getErrorResponse(authResponse));
    return null;
  },
  logout: async (token) => {
    const logoutResponse = await ApiMethods.getPostResultAlpha(routes.logoutRoute, { token: token }, null)
    if (logoutResponse.data) {
      return logoutResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(logoutResponse));
    return null;
  },

  modifyUser: async (newUserInfos) => {
    const { email } = newUserInfos;
    const { login } = newUserInfos;
    const { password } = newUserInfos;
    const { token } = newUserInfos;
    const data = {
      token: token,
      email: email,
      login: login,
      password: password
    };

    const modifyUserResponse = await ApiMethods.getPostResultAlpha(routes.modifyUserRoute, data);
    if (modifyUserResponse.data) {
      return modifyUserResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(modifyUserResponse));
    return null;
  },

  changePassword: async (newUserInfos) => {
    const { email } = newUserInfos;
    const { login } = newUserInfos;
    const { password } = newUserInfos;
    const { newPassword } = newUserInfos;
    const { token } = newUserInfos;
    const data = {
      token: token,
      email: email,
      login: login,
      password: password,
      newPassword: newPassword
    };

    const changePasswordResponse = await ApiMethods.getPostResultAlpha(routes.changePasswordRoute, data);
    if (changePasswordResponse.data) {
      return changePasswordResponse.data;
    } 
    console.log(ApiMethods.getErrorResponse(changePasswordResponse));
    return null;
  },

  getMealsData: async (token) => {
    const jsonToDate = (response) => {
      for (let i = 0; i < response.length; i++) {
        const buffer = response[i].day;
        response[i].day = new Date(buffer);
      }
    }
    const mealsResponse = await ApiMethods.getPostResultAlpha(routes.getMealsRoute, { token: token }, jsonToDate);
    if (mealsResponse.data !== undefined) {
      return mealsResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(mealsResponse));
    return null;
  },

  getObjectives: async (token) => {
    const jsonToDate = (response) => {
      const bufferStartingDate = response.startingDate;
      const bufferEndingDate = response.endingDate;
      response.startingDate = new Date(bufferStartingDate);
      response.endingDate = new Date(bufferEndingDate);
    }
    const objectiveResponse = await ApiMethods.getPostResultAlpha(routes.getObjectivesRoute, { token: token }, jsonToDate);
    if (objectiveResponse.data !== undefined) {
      return objectiveResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(objectiveResponse));
    return null;
  },

  getMeasurements: async (token) => {
    const measurementsResponse = await ApiMethods.getPostResultAlpha(routes.getMeasurementsRoute, { token: token }, null);
    if (measurementsResponse.data !== undefined) {
      return measurementsResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(measurementsResponse));
    return null;
  },

  getRecipes: async () => {
    const recipesResponse = await ApiMethods.getPostResultAlpha(routes.getRecipesRoute, {}, null);
    if (recipesResponse.data !== undefined) {
      return recipesResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(recipesResponse));
    return null;
  },
}
export default LoginApiCalls;