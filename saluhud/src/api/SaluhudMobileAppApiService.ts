import i18next from "@root/i18n.config";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import ApiErrorResponse from "@src/response/ApiErrorResponse";
import ApiErrorException from "@src/exception/ApiErrorException";
import { SetStateAction } from "react";
import SaluhudUserFitnessDataDTO from "@src/dto/user/SaluhudUserFitnessDataDTO";
import SaluhudUserDTO from "@src/dto/user/SaluhudUserDTO";

const getCommonApiHttpRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Language': i18next.language,
  'X-API-KEY': SaluhudMobileAppConfiguration.apiKey,
});

export async function executeGetRequest(customHeaders: Map<string, string>, url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const response = await fetch(
    url,
    {
      method: 'GET',
      headers: {...getCommonApiHttpRequestHeaders(), ...Object.fromEntries(customHeaders)},
      signal: controller.signal,
    },
  );

  clearTimeout(timeout);

  if (!response.ok) {
    const apiErrorResponse: ApiErrorResponse = await response.json();
    throw new ApiErrorException(
      apiErrorResponse.errorMessage,
      response.status,
      apiErrorResponse.apiEndPoint,
    );
  }

  return response;
}

export async function executePostRequest(customHeaders: Map<string, string>, url: string, data: any)
{
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const response = await fetch(
    url,
    {
      method: 'POST',
      headers: {...getCommonApiHttpRequestHeaders(), ...Object.fromEntries(customHeaders)},
      body: JSON.stringify(data),
      signal: controller.signal,
    },
  );

  clearTimeout(timeout);

  if (!response.ok) {
    const apiErrorResponse: ApiErrorResponse = await response.json();
    throw new ApiErrorException(
      apiErrorResponse.errorMessage,
      response.status,
      apiErrorResponse.apiEndPoint,
    );
  }

  return response;
}

export const getSaluhudUserFitnessData = async (setLoading: (value: SetStateAction<boolean>) => void, 
    customHeadersMap: Map<string, string>, 
    setFitnessData: (value: SetStateAction<SaluhudUserFitnessDataDTO | undefined>) => void) => {
        
    setLoading(true);
    try {
        const response = await executeGetRequest(customHeadersMap, "http://" + SaluhudMobileAppConfiguration.backendURL
            + SaluhudMobileAppConfiguration.saluhudUserFitnessDataEndpoint);

        const fitnessData: SaluhudUserFitnessDataDTO = await response.json();

        setFitnessData(fitnessData);
        console.log(fitnessData);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

export const getSaluhudUserData = async (
  customHeadersMap: Map<string, string>,
  setUserData: (value: SetStateAction<SaluhudUserDTO | null>) => void,
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.saluhudUserDataEndpoint,
  );

  const userData: SaluhudUserDTO = await response.json();

  setUserData(userData);
  console.log(userData);
};
