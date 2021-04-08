
import axios from 'axios';

const ApiMethods = {
  getPostResultAlpha: async (route, jsonObject, next) => {
    try {
      const response = await axios.post(
        route,
        jsonObject
      );
      if (next && response?.status === 200) {
        next(response.data);
      }
      return response;
    } catch (err) {
      return err;
    }
  },

  getErrorResponse: (errorResponse) => (
    errorResponse.response ||
    errorResponse.request ||
    errorResponse.message ||
    'invalid response object'
  )

}

export default ApiMethods;
/*
const GetApiCalls = () => {
  const getMeasurementsFromApi = async (token) => {
      try {
         const result = await axios.post(
            routes.getMeasurementsRoute, 
            {
               token: token,
            }
         );
//            dispatch({type: actions.SET_MEASUREMENTS, payload: {...result.data}});
         return result.data;
      } catch (err) {
         return null;
      }
   }
  const getObjectivesFromApi = async (token) => {
      try {
         const result = await axios.post(
            routes.getObjectivesRoute, 
            {
               token: token,
            }
         )
         const bufferStartingDate = result.data.startingDate;
         const bufferEndingDate = result.data.endingDate;
         result.data.startingDate = new Date(bufferStartingDate);
         result.data.endingDate = new Date(bufferEndingDate);
         if (result.data) {

          //           await dispatch({type: actions.SET_OBJECTIVES, payload: {...result.data}});
         }
         return result.data;
      } catch(err) {
         console.log(err);
         return null;
      }

   }
   const getMealsFromApi = async (token) => {
      try {
        const result = await axios.post(
         routes.getMealsRoute,
           {
              token: token
           }
         );
         for (let i = 0; i < result.data.length; i++) {
            const buffer = result.data[i].day;
            result.data[i].day = new Date(buffer);
         }
         return result.data;
//         await dispatch({type: actions.ADD_MEAL, payload: [...result.data]});
      }
      catch(error) {
         console.log(error);
      }
    }

   const getRecipesFromApi = async () => {
      try {
        const result = await axios.post(
         routes.getRecipesRoute,
           {
           }
         );
//        dispatch({type: actions.ADD_RECIPE, payload: [...result.data]});
           return result.data;
      }
      catch(error) {
        console.log(error);
      }
   }
   const getLoginToken = async (login, password, email) => {
   try {
    const result = await axios.post(
       routes.loginRoute,
       {
          login: login,
          password: password,
          email: email
       });
       return result.data;
      } catch(err) {

      }
    }
}
*/
//export default GetApiCalls;