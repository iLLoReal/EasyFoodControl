import * as routes from '../Routes';
import ApiMethods from './ApiMethods';

const ObjectivesApiCalls = {
  sendObjectives: async (token, objective) => {
    const objectivesResponse = await ApiMethods.getPostResultAlpha(routes.setObjectivesRoute, { token: token, objective: objective }, null);
    if (objectivesResponse.data !== undefined) {
      return objectivesResponse.data;
    }
    else {
      console.log(ApiMethods.getErrorResponse(objectivesResponse));
      return null;
    }
  },
  sendMeasurements: async (token, measurements) => {
    const measurementsResponse = await ApiMethods.getPostResultAlpha(routes.setMeasurementsRoute, { token: token, measurements: measurements }, null);
    if (measurementsResponse.data !== undefined) {
      return measurementsResponse.data;
    } else {
      console.log(ApiMethods.getErrorResponse(measurementsResponse));
      return null;
    }
  }
}
export default ObjectivesApiCalls;
