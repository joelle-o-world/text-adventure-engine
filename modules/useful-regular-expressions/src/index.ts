export const endsWithShortConsonant = /[aeiou][tpdnlm]$/;
export const endsWithDoubleShortConsonant = /[aeiou](tt|pp|dd|nn|ll|mm)$/;
export const endsWithIng = /ing$/;
export const endsWithE = /e$/;
export const endsWithEd = /ed$/;
export const endsWithOOrX = /[oxzs]$/;
export const endsWithOesOrXes = /[xzos]es$/;
export const endsWithS = /s$/;
export const firstLetterCapital = /^[A-Z]/;

/**
 * Any number of words, each of which begin with a capitol letter
 */
export const properNounRegex = /^[A-Z]\w*(?: [A-Z]\w*)*$/;

export const possessiveAdjectiveRegex =
  /my|your|his|her|its|their|(?:[\w ]*\w(?:\'s|s\'))/;
