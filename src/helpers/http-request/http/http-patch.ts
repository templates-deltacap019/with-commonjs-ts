const axios = require('axios');
import {
  APIRequestType,
  APIResultType
} from "../../../types/api-params";

const {
  logRequest,
  logError,
  logResponse,
} = require('../log');
const { ServerError } = require('../../errors');

const requestPatch = async (params: APIRequestType) => {
  const {
    url,
    headers = {},
    reqParams = {},
  } = params;

  let apiResult: APIResultType;
  let apiResponse: any = null;
  let apiError: any = null;

  const reqConfig = {
    method: 'PATCH',
    url,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    data: {
      ...reqParams,
    },
  };

  const finalUrl = await axios.getUri(reqConfig);

  try {
    return await axios(reqConfig).then((response: any) => {
      if ([200, 201, 204].includes(response.status) === false) {
        const errorObj = {
          message: `Request Failed, Invalid HTTP Status code ${response.status}`,
          data: response,
        };
        throw new ServerError(response.status, errorObj);
      }
      logRequest({
        ...reqConfig,
        ...params,
        url: finalUrl,
      });
      apiResponse = response.data;
      logResponse(params, apiResponse);

      apiResult = {
        status: response.status,
        response: apiResponse,
        error: apiError,
      };
      return apiResult;
    }).catch((error: any) => {
      apiError = new Error(error.message);
      let errorMessage = error.message;
      const { response, data } = error;

      if (response) {
        apiResponse = response;
        errorMessage = (response?.message) ? response?.message : errorMessage;
      }

      if (response.data) {
        apiResponse = response.data;
        errorMessage = (apiResponse?.message) ? apiResponse?.message : errorMessage;
      }

      if (data?.data) {
        apiResponse = data?.data;
        errorMessage = (data?.message) ? data?.message : errorMessage;
      }

      apiResult = {
        status: response?.status ?? 0,
        response: apiResponse,
        error: new Error(errorMessage),
      };

      logRequest({
        ...reqConfig,
        ...params,
        url: finalUrl,
      });
      logError(params, errorMessage);

      return apiResult;
    });
  } catch (error: any) {
    apiError = new Error(error.message);
    apiResult = {
      status: 400,
      response: apiResponse,
      error: apiError,
    };

    logRequest({
      ...reqConfig,
      ...params,
      url: finalUrl,
    });
    logError(params, error.message);

    return apiResult;
  }
};

module.exports = {
  requestPatch,
};
