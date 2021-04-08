import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const RecipesApiCalls = {
  sendRecipes: async (recipes, recipeId, token) => {
    const data = {
      recipes: recipes,
      recipeId: recipeId,
      token: (!token || !token.length ) ? undefined : token,
    };
    const recipesResponse = await ApiMethods.getPostResultAlpha(routes.recipesRoute, data, null);
    if (recipesResponse?.data !== undefined && recipesResponse.data !== 'No recipes') {
      return recipesResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(recipesResponse));
    return null;
  }
}
export default RecipesApiCalls;