import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const LoginApiCalls = {
    getLoginToken: async (login, password, email) => {
        const authResponse = await ApiMethods.getPostResultAlpha(routes.loginRoute, { login: login, password: password, email: email }, null)
        if (authResponse.data) {
            const token = authResponse.data.token;
            return token;
        }
        else {
            console.log(ApiMethods.getErrorResponse(authResponse));
            return null;
        }
    },
    logout: async (token) => {
        const logoutResponse = await ApiMethods.getPostResultAlpha(routes.logoutRoute, { token: token }, null)
        if (logoutResponse.data) {
            console.log('Sending data back');
            return logoutResponse.data;
        }
        else {
            console.log(ApiMethods.getErrorResponse(logoutResponse));
            return null;
        }
    },
    
    modifyUser: async (newUserInfos) => {
        const { email } = newUserInfos;
        const { login } = newUserInfos;
        const { password } = newUserInfos;
        const { token } = newUserInfos;

        const modifyUserResponse = await ApiMethods.getPostResultAlpha(routes.modifyUserRoute, {token: token, email: email, login: login, password: password});
        if (modifyUserResponse.data) {
            return modifyUserResponse.data;
        } else {
            console.log(ApiMethods.getErrorResponse(modifyUserResponse));
            return null;
        }
    },
    changePassword: async (newUserInfos) => {
        const { email } = newUserInfos;
        const { login } = newUserInfos;
        const { password } = newUserInfos;
        const { newPassword } = newUserInfos;
        const { token } = newUserInfos;

        const changePasswordResponse = await ApiMethods.getPostResultAlpha(routes.changePasswordRoute, {token: token, email: email, login: login, password: password, newPassword: newPassword});
        if (changePasswordResponse.data) {
            return changePasswordResponse.data;
        } else {
            console.log(ApiMethods.getErrorResponse(changePasswordResponse));
            return null;
        }
    },
    getMealsData: async (token) => {
        const mealsResponse = await ApiMethods.getPostResultAlpha(routes.getMealsRoute, { token: token }, 
        (response) => {
            console.log(`before for : ${JSON.stringify(response)}`);
            for (let i = 0; i < response.length; i++) {
                console.log(`in meals, about to change in for loop`);
                const buffer = response[i].day;
                response[i].day = new Date(buffer);}
            });
        if (mealsResponse.data !== undefined) {
            console.log('data in meals');
             return mealsResponse.data;
    //         await dispatch({type: actions.ADD_MEAL, payload: [...result.data]});
        }
        else {
            console.log(mealsResponse.data);
            console.log(ApiMethods.getErrorResponse(mealsResponse));
            return null;
        }
    },
    getObjectives: async (token) => {
        const objectiveResponse = await ApiMethods.getPostResultAlpha(routes.getObjectivesRoute, { token: token }, 
        (response) => {
            console.log(`in getObjectives.next : ${JSON.stringify(response)}`);
            const bufferStartingDate = response.startingDate;
            const bufferEndingDate = response.endingDate;
            response.startingDate = new Date(bufferStartingDate);
            response.endingDate = new Date(bufferEndingDate);
        });
        if (objectiveResponse.data !== undefined) {
            console.log('data in objectives');
             return objectiveResponse.data;
    //         await dispatch({type: actions.ADD_MEAL, payload: [...result.data]});
        }
        else {
            console.log(ApiMethods.getErrorResponse(objectiveResponse));
            return null;
        }
    },
    getMeasurements: async (token) => {
        const measurementsResponse = await ApiMethods.getPostResultAlpha(routes.getMeasurementsRoute, { token: token }, null);
        if (measurementsResponse.data !== undefined) {
            console.log('data in measurements');
             return measurementsResponse.data;
        }
        else {
            console.log(ApiMethods.getErrorResponse(measurementsResponse));
            return null;
        }
    },
    getRecipes: async () => {
        const recipesResponse = await ApiMethods.getPostResultAlpha(routes.getRecipesRoute, {}, null);
        if (recipesResponse.data !== undefined) {
            console.log('data in Recipes');
             return recipesResponse.data;
        }
        else {
            console.log(ApiMethods.getErrorResponse(recipesResponse));
            return null;
        }
    },
}
export default LoginApiCalls;