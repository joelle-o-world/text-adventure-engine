import getAuxiliaryVerb from "./getAuxiliaryVerb";

export default function makeNegative(infinitive: string) {
  let { aux, remainder } = getAuxiliaryVerb(infinitive);

  return remainder ? `${aux} not ${remainder}` : `${aux} not`;
}
