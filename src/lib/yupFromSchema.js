import { buildYup } from 'schema-to-yup'

export default ({ inputs }) => {

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {},
    required: [],
  }

  const validatableInputs = inputs.filter(a => (a && a.validations))
  const config = {
    errMessages: {}
  }

  for (const input of validatableInputs) {
    const { validations } = input
    const properties = {}
    const messages = {}

    for (const validation of validations) {
      const { kind } = validation
      properties[kind] = validation.value
      messages[kind] = validation.message
    }

    schema.properties[input.id] = {
      type: input.type ? input.type : 'string',
      ...properties
    }

    if (properties.required) {
      schema.required.push(input.id)
    }

    config.errMessages[input.id] = messages
  }

  const yupSchema = buildYup(schema, config)
  return yupSchema
}
