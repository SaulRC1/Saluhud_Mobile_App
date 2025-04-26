import i18next from "@root/i18n.config";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import ApiErrorResponse from "@src/response/ApiErrorResponse";
import ApiErrorException from "@src/exception/ApiErrorException";

const commonApiHttpRequestHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Language': i18next.language,
  'X-API-KEY': SaluhudMobileAppConfiguration.apiKey,
};

export async function executeGetRequest(customHeaders: Map<string, string>, url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const response = await fetch(
    url,
    {
      method: 'GET',
      headers: {...commonApiHttpRequestHeaders, ...Object.fromEntries(customHeaders)},
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
