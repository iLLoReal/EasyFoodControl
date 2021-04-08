import ApiMethods from './ApiMethods';
import * as routes from '../Routes';

const AddMealsApiCalls = {
    sendMeals: async (token, meals) => {
        const data = {
            token: token,
            meals: meals
        };

        const addMealsResponse = await ApiMethods.getPostResultAlpha(routes.addMealRoute, data, null);
        if (addMealsResponse?.status) {
            return (addMealsResponse.status === 201);
        }
        console.log(ApiMethods.getErrorResponse(addMealsResponse));
        return null;
    }
}

export default AddMealsApiCalls;