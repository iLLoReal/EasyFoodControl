import ApiMethods from './ApiMethods';
import * as routes from '../Routes';

const AddMealsApiCalls = {
    sendMeals: async (token, meals) => {
        const addMealsResponse = await ApiMethods.getPostResultAlpha(routes.addMealRoute, {token: token, meals: meals}, null);
        if (addMealsResponse.status === 201) {
            return true;
        } else if (addMealsResponse.status === 403) {
            return false;
        } else {
            console.log(ApiMethods.getErrorResponse(addMealsResponse));
            return null;
        }
    }
}

export default AddMealsApiCalls;