# english-morphology

## Functions

### conjugate

▸ **conjugate**(`infinitive`, `person`): ``null`` \| `string` \| `string`[]

Conjugate an english verb

#### Parameters

| Name | Type |
| :------ | :------ |
| `infinitive` | `string` |
| `person` | ``"infinitive"`` \| ``"firstPersonSingular"`` \| ``"secondPersonSingular"`` \| ``"thirdPersonSingular"`` \| ``"firstPersonPlural"`` \| ``"secondPersonPlural"`` \| ``"thirdPersonPlural"`` \| ``"gerund"`` \| ``"pastParticiple"`` \| ``"pastTense"`` |

#### Returns

``null`` \| `string` \| `string`[]

#### Defined in

[conjugate.ts:155](https://github.com/joelyjoel/english-morphology/blob/9c30e8e/src/conjugate.ts#L155)

___

### conjugationTable

▸ **conjugationTable**(`infinitive`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `infinitive` | `string` |

#### Returns

`Object`

#### Defined in

[conjugate.ts:170](https://github.com/joelyjoel/english-morphology/blob/9c30e8e/src/conjugate.ts#L170)

___

### deconjugate

▸ **deconjugate**(`word`): `Generator`<{ `form`: `string` ; `infinitive`: `string` = infinitiveHypothesis }, `void`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `word` | `string` |

#### Returns

`Generator`<{ `form`: `string` ; `infinitive`: `string` = infinitiveHypothesis }, `void`, `unknown`\>

#### Defined in

[conjugate.ts:202](https://github.com/joelyjoel/english-morphology/blob/9c30e8e/src/conjugate.ts#L202)

___

### deconjugateConcise

▸ **deconjugateConcise**(`word`): { `forms`: `VerbForm`[] ; `infinitive`: `string`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `word` | `string` |

#### Returns

{ `forms`: `VerbForm`[] ; `infinitive`: `string`  }[]

#### Defined in

[conjugate.ts:227](https://github.com/joelyjoel/english-morphology/blob/9c30e8e/src/conjugate.ts#L227)

___

### plural

▸ **plural**(`singularNoun`): `string` \| `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `singularNoun` | `string` |

#### Returns

`string` \| `string`[]

#### Defined in

[plural.ts:71](https://github.com/joelyjoel/english-morphology/blob/9c30e8e/src/plural.ts#L71)

___

### singular

▸ **singular**(`pluralNoun`): `string` \| `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluralNoun` | `string` |

#### Returns

`string` \| `string`[]

#### Defined in

[plural.ts:81](https://github.com/joelyjoel/english-morphology/blob/9c30e8e/src/plural.ts#L81)
