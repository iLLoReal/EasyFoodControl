import ApiMethods from './ApiMethods';
import * as routes from '../Routes';

const GeneralApiCalls = {
    verifyToken: async (token) => {
        const verifyTokenRepsonse = await ApiMethods.getPostResultAlpha(routes.verifyTokenRoute, {token: token}, null);
        if (verifyTokenRepsonse?.status !== undefined) {
           return verifyTokenRepsonse.status;
        } else {
            console.log(ApiMethods.getErrorResponse(verifyTokenRepsonse));
            return null;
        }
    }
}
export default GeneralApiCalls;
