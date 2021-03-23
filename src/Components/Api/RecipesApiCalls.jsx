import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const RecipesApiCalls = {
  sendRecipes: async (recipes, recipeId, token) => {
    if (!token || !token.length)
      token = undefined;
    const recipesResponse = await ApiMethods.getPostResultAlpha(routes.recipesRoute, {recipeId: recipeId, recipes: recipes, token: token}, null);
    if (recipesResponse.data !== undefined && recipesResponse.data !== 'No recipes') {
      return recipesResponse.data;
    }
    else {
      console.log(ApiMethods.getErrorResponse(recipesResponse));
      return null;
    }
  }
}
export default RecipesApiCalls;