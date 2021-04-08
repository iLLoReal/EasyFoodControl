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
