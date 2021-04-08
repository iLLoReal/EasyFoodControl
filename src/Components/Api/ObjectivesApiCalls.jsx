import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const ObjectivesApiCalls = {
  sendObjectives: async (token, objective) => {
    const data = {
      token: token,
      objective: objective
    };

    const objectivesResponse = await ApiMethods.getPostResultAlpha(routes.setObjectivesRoute, data, null);
    if (objectivesResponse.data !== undefined) {
      return objectivesResponse.data;
    }
    console.log(ApiMethods.getErrorResponse(objectivesResponse));
    return null;
  },

  sendMeasurements: async (token, measurements) => {
    const data = {
      token: token,
      measurements: measurements
    };

    const measurementsResponse = await ApiMethods.getPostResultAlpha(routes.setMeasurementsRoute, data, null);
    if (measurementsResponse.data !== undefined) {
      return measurementsResponse.data;
    } 
    console.log(ApiMethods.getErrorResponse(measurementsResponse));
    return null;
  }
}
export default ObjectivesApiCalls;
