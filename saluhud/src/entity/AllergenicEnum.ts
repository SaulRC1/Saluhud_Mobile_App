import RecipeCardAllergenicDTO from "@src/dto/nutrition/RecipeCardAllergenicDTO";

export const enum AllergenicEnum {
    GLUTEN = 1,
    CRUSTACEAN = 2,
    EGG = 3,
    FISH = 4,
    PEANUT = 5,
    SOYA_BEAN = 6,
    CELERY = 7,
    MUSTARD = 8,
    SESAME_SEED = 9,
    SULFUR_DIOXIDE_AND_SULPHITES = 10,
    LUPIN_BEAN = 11,
    NUTS = 12,
    MOLLUSK = 13,
    LACTOSE = 14
}

export const fromAllergenicId = (id: number) => {
  switch (id) {
    case 1:
      return AllergenicEnum.GLUTEN;
    case 2:
      return AllergenicEnum.CRUSTACEAN;
    case 3:
      return AllergenicEnum.EGG;
    case 4:
      return AllergenicEnum.FISH;
    case 5:
      return AllergenicEnum.PEANUT;
    case 6:
      return AllergenicEnum.SOYA_BEAN;
    case 7:
      return AllergenicEnum.CELERY;
    case 8:
      return AllergenicEnum.MUSTARD;
    case 9:
      return AllergenicEnum.SESAME_SEED;
    case 10:
      return AllergenicEnum.SULFUR_DIOXIDE_AND_SULPHITES;
    case 11:
      return AllergenicEnum.LUPIN_BEAN;
    case 12:
      return AllergenicEnum.NUTS;
    case 13:
      return AllergenicEnum.MOLLUSK;
    case 14:
      return AllergenicEnum.LACTOSE;
    default:
      return undefined;
  }
};

export const mapRecipeCardAllergenicDTOToAllergenicEnum = (
  recipeAllergenics: RecipeCardAllergenicDTO[],
) => {
  let allergenicEnums: AllergenicEnum[] = [];

  recipeAllergenics.forEach(recipeAllergenic => {
    let allergenicEnum = fromAllergenicId(recipeAllergenic.allergenicId);

    if (allergenicEnum !== undefined) {
      allergenicEnums.push(allergenicEnum);
      //console.log("Pushed allergenic: " + allergenicEnum);
    }
  });

  return allergenicEnums;
};