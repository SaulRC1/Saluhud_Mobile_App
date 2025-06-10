import i18next from "@root/i18n.config";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import ApiErrorResponse from "@src/response/ApiErrorResponse";
import ApiErrorException from "@src/exception/ApiErrorException";
import { SetStateAction } from "react";
import SaluhudUserFitnessDataDTO from "@src/dto/user/SaluhudUserFitnessDataDTO";
import SaluhudUserDTO from "@src/dto/user/SaluhudUserDTO";
import RecipeDetailDTO from "@src/dto/nutrition/RecipeDetailDTO";
import MenuCardDTO from "@src/dto/nutrition/MenuCardDTO";
import CreateNewMenuDTO from "@src/dto/nutrition/CreateNewMenuDTO";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import MenuDayDTO from "@src/dto/nutrition/MenuDayDTO";
import MenuDayDetailDTO from "@src/dto/nutrition/MenuDayDetailDTO";
import RecipeNameAndIdDataDTO from "@src/dto/nutrition/RecipeNameAndIdDataDTO";
import AddMenuDayToMenuDTO from "@src/dto/nutrition/AddMenuDayToMenuDTO";
import AddRecipeToMenuDayDTO from "@src/dto/nutrition/AddRecipeToMenuDayDTO";
import EditMenuDTO from "@src/dto/nutrition/EditMenuDTO";
import RecipeCardDTO from "@src/dto/nutrition/RecipeCardDTO";
import MenuDayRecipeDTO from "@src/dto/nutrition/MenuDayRecipeDTO";
import DailyStepsHistoricalEntryDTO from "@src/dto/user/DailyStepsHistoricalEntryDTO";
import DailyStepsHistoricalDateRangeDTO from "@src/dto/user/DailyStepsHistoricalDateRangeDTO";
import RegisterDailyStepsHistoricalEntryDTO from "@src/dto/user/RegisterDailyStepsHistoricalEntryDTO";
import SleepHistoricalEntryDTO from "@src/dto/user/SleepHistoricalEntryDTO";
import SleepHistoricalDateRangeDTO from "@src/dto/user/SleepHistoricalDateRangeDTO";
import RegisterSleepHistoricalEntryDTO from "@src/dto/user/RegisterSleepHistoricalEntryDTO";
import WeightHistoricalEntryDTO from "@src/dto/user/WeightHistoricalEntryDTO";
import WeightHistoricalDateRangeDTO from "@src/dto/user/WeightHistoricalDateRangeDTO";
import RegisterWeightHistoricalEntryDTO from "@src/dto/user/RegisterWeightHistoricalEntryDTO";

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

export async function executeDeleteRequest(customHeaders: Map<string, string>, url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const response = await fetch(
    url,
    {
      method: 'DELETE',
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

export async function executePutRequest(customHeaders: Map<string, string>, url: string, data?: any)
{
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const response = await fetch(
    url,
    {
      method: 'PUT',
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

export const getRecipeDetailData = async (customHeadersMap: Map<string, string>, recipeID: bigint) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.recipeDetailDataEndpoint + "?recipeID=" + recipeID.toString()
  );

  const recipeDetail: RecipeDetailDTO = await response.json();
  return recipeDetail;
};

export const getMenuCardData = async (customHeadersMap: Map<string, string>) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.menuCardDataEndpoint
  );

  const menuCardData: MenuCardDTO[] = await response.json();
  return menuCardData;
};

export const postCreateNewMenu = async (customHeadersMap: Map<string, string>, newMenu: CreateNewMenuDTO) => {
  const response = await executePostRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.createNewMenuEndpoint,
      newMenu
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const getMenuDetailData = async (customHeadersMap: Map<string, string>, menuID: bigint) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.menuDetailDataEndpoint + "?menuID=" + menuID
  );

  const menuDetailData: MenuDayDTO[] = await response.json();
  return menuDetailData;
};

export const getMenuDayDetailData = async (customHeadersMap: Map<string, string>, menuDayID: bigint) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.menuDayDetailDataEndpoint + "?menuDayID=" + menuDayID
  );

  const menuDetailData: MenuDayDetailDTO = await response.json();
  return menuDetailData;
};

export const getRecipesNameAndIdData = async (customHeadersMap: Map<string, string>) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.recipesNameAndIdDataEndpoint
  );

  const menuDetailData: RecipeNameAndIdDataDTO[] = await response.json();
  return menuDetailData;
};

export const postAddMenuDayToMenu = async (customHeadersMap: Map<string, string>, menuDay: AddMenuDayToMenuDTO) => {
  const response = await executePostRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.addMenuDayToMenuEndpoint,
      menuDay
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const postAddRecipeToMenuDay = async (customHeadersMap: Map<string, string>, recipe: AddRecipeToMenuDayDTO) => {
  const response = await executePostRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.addRecipeToMenuDayEndpoint,
      recipe
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const removeRecipeFromMenuDay = async (customHeadersMap: Map<string, string>, menuDayId: bigint, menuDayRecipeId: bigint) => {
  const response = await executeDeleteRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.removeRecipeFromMenuDayEndpoint.replace("{menuDayId}/{menuDayRecipeId}", 
        menuDayId.toString() + "/" + menuDayRecipeId.toString())
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const removeMenuDayFromMenu = async (customHeadersMap: Map<string, string>, menuId: bigint, menuDayId: bigint) => {
  const response = await executeDeleteRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.removeMenuDayFromMenuEndpoint.replace("{menuId}/{menuDayId}", 
        menuId.toString() + "/" + menuDayId.toString())
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const removeMenu = async (customHeadersMap: Map<string, string>, menuId: bigint) => {
  const response = await executeDeleteRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.removeMenuEndpoint.replace("{menuId}", menuId.toString())
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const putEditMenu = async (customHeadersMap: Map<string, string>, editMenuDTO: EditMenuDTO) => {
  const response = await executePutRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.editMenuEndpoint,
      editMenuDTO
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const putSetMenuAsFavourite = async (customHeadersMap: Map<string, string>, menuId: bigint) => {
  const response = await executePutRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.setMenuAsFavouriteEndpoint.replace("{menuId}", menuId.toString())
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const getSaluhudUserFitnessDataDTO = async (
  customHeadersMap: Map<string, string>,
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.saluhudUserFitnessDataEndpoint,
  );

  const fitnessData: SaluhudUserFitnessDataDTO = await response.json();

  return fitnessData;
};

export const getRecipeRecommendations = async (
  customHeadersMap: Map<string, string>,
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.recipeRecommendationsEndpoint,
  );

  const responseJSON: RecipeCardDTO[] = await response.json();

  return responseJSON;
};

export const getNextFavouriteMenuRecipe = async (
  customHeadersMap: Map<string, string>,
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.nextFavouriteMenuRecipe,
  );

  const responseJSON: MenuDayRecipeDTO = await response.json();

  return responseJSON;
};

export const getDailyStepHistoricalEntries = async (
  customHeadersMap: Map<string, string>,
  startDate: string,
  endDate: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.dailyStepsHistoricalEntriesEndpoint + "?startDate=" + startDate + "&endDate=" + endDate,
  );

  const responseJSON: DailyStepsHistoricalEntryDTO[] = await response.json();

  return responseJSON;
};

export const getCurrentWeekDailyStepHistoricalEntries = async (
  customHeadersMap: Map<string, string>
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.currentWeekDailyStepsHistoricalEntriesEndpoint,
  );

  const responseJSON: DailyStepsHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const getWeekDailyStepHistoricalEntries = async (
  customHeadersMap: Map<string, string>,
  moveWeek: number,
  date: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weekDailyStepsHistoricalEntriesEndpoint + "?moveWeek=" + moveWeek 
      + "&date=" + date,
  );

  const responseJSON: DailyStepsHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const postRegisterNewDailyStepsHistoricalEntry = async (customHeadersMap: Map<string, string>, 
  newEntry: RegisterDailyStepsHistoricalEntryDTO) => {
  const response = await executePostRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.registerNewDailyStepsHistoricalEntryEndpoint,
      newEntry
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const getWeekDailyStepHistoricalEntriesByDate = async (
  customHeadersMap: Map<string, string>,
  date: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weekDailyStepsHistoricalEntriesByDateEndpoint + "?date=" + date,
  );

  const responseJSON: DailyStepsHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const getSleepHistoricalEntries = async (
  customHeadersMap: Map<string, string>,
  startDate: string,
  endDate: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.sleepHistoricalEntriesEndpoint + "?startDate=" + startDate + "&endDate=" + endDate,
  );

  const responseJSON: SleepHistoricalEntryDTO[] = await response.json();

  return responseJSON;
};

export const getCurrentWeekSleepHistoricalEntries = async (
  customHeadersMap: Map<string, string>
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.currentWeekSleepHistoricalEntriesEndpoint,
  );

  const responseJSON: SleepHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const getWeekSleepHistoricalEntries = async (
  customHeadersMap: Map<string, string>,
  moveWeek: number,
  date: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weekSleepHistoricalEntriesEndpoint + "?moveWeek=" + moveWeek 
      + "&date=" + date,
  );

  const responseJSON: SleepHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const postRegisterNewSleepHistoricalEntry = async (customHeadersMap: Map<string, string>, 
  newEntry: RegisterSleepHistoricalEntryDTO) => {
  const response = await executePostRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.registerNewSleepHistoricalEntryEndpoint,
      newEntry
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const getWeekSleepHistoricalEntriesByDate = async (
  customHeadersMap: Map<string, string>,
  date: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weekSleepHistoricalEntriesByDateEndpoint + "?date=" + date,
  );

  const responseJSON: SleepHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const getWeightHistoricalEntries = async (
  customHeadersMap: Map<string, string>,
  startDate: string,
  endDate: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weightHistoricalEntriesEndpoint + "?startDate=" + startDate + "&endDate=" + endDate,
  );

  const responseJSON: WeightHistoricalEntryDTO[] = await response.json();

  return responseJSON;
};

export const getCurrentWeekWeightHistoricalEntries = async (
  customHeadersMap: Map<string, string>
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.currentWeekWeightHistoricalEntriesEndpoint,
  );

  const responseJSON: WeightHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const getWeekWeightHistoricalEntries = async (
  customHeadersMap: Map<string, string>,
  moveWeek: number,
  date: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weekWeightHistoricalEntriesEndpoint + "?moveWeek=" + moveWeek 
      + "&date=" + date,
  );

  const responseJSON: WeightHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};

export const postRegisterNewWeightHistoricalEntry = async (customHeadersMap: Map<string, string>, 
  newEntry: RegisterWeightHistoricalEntryDTO) => {
  const response = await executePostRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.registerNewWeightHistoricalEntryEndpoint,
      newEntry
  );

  const responseJSON : ApiInformationResponse = await response.json();
  return responseJSON;
};

export const getWeekWeightHistoricalEntriesByDate = async (
  customHeadersMap: Map<string, string>,
  date: string
) => {
  const response = await executeGetRequest(
    customHeadersMap,
    'http://' +
      SaluhudMobileAppConfiguration.backendURL +
      SaluhudMobileAppConfiguration.weekWeightHistoricalEntriesByDateEndpoint + "?date=" + date,
  );

  const responseJSON: WeightHistoricalDateRangeDTO = await response.json();

  return responseJSON;
};