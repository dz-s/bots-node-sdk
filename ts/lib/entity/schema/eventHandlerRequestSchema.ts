import * as Joi from '@hapi/joi';
/**
 * Component invocation request schema factory
 */
export = (joi: any): Joi.Schema => {
  const contextSchema = joi.object().keys({
    variables: joi.object().pattern(/(.*)/, joi.object().keys({
      entity: joi.boolean().required(),
      type: joi.alternatives().when('entity', {
        is: true,
        then: joi.object().keys({
          type: joi.string().required(),
          name: joi.string().required(),
          patternExpression: joi.string().allow(null),
          parentEntity: joi.any(),
          ruleParameters: joi.any(),
          enumValues: joi.when('type', {
            is: 'ENUMVALUES',
            then: joi.string().required(),
            otherwise: joi.any()
          })
        }).required(),
        otherwise: joi.string().required()
      }),
      value: joi.any().allow(null)
    })),
    parent: joi.object().allow(null)
  });
  const entityResolutionEventSchema = joi.object({
    name: joi.string().required(),
    eventItem: joi.string().optional(),
    custom: joi.boolean().required(),
    properties: joi.object().allow(null)
  });
  const compositeBagItemSchema = joi.object({
    name: joi.string().required(),
    type: joi.string().required(),
    entityName: joi.string().optional(),
  });
  const entityResolutionStatusSchema = joi.object({
    name: joi.string().optional(),
    resolvingField: joi.string().optional(),
    validationErrors: joi.object().required(),
    skippedItems: joi.array().items(joi.string()),
    updatedEntities: joi.array().items(compositeBagItemSchema),
    outOfOrderMatches: joi.array().items(compositeBagItemSchema),
    allMatches: joi.array().items(compositeBagItemSchema),
    disambiguationValues: joi.object().required(),
    userInput: joi.string().optional(),
    customProperties: joi.object().required(),
    shouldPromptCache: joi.object().required()
  });
  const requestSchema = joi.object({
    botId: joi.string().required(),
    platformVersion: joi.string().required(),
    state: joi.string().optional(),
    variableName: joi.string().required(),
    entityResolutionStatus: entityResolutionStatusSchema.required(),
    events: joi.array().items(entityResolutionEventSchema),
    candidateMessages: joi.any().allow(null),
    context: contextSchema.required()
  });
  return requestSchema;
};
