import { buildYup } from 'schema-to-yup'
// import { buildYup as buildYup2 } from 'json-schema-to-yup'

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

    for (var i in validatableInputs) {
        const validatableInput = validatableInputs[i]

        const { validations } = validatableInput
        const properties = {}
        const messages = {}

        for (var j in validations) {
            const validation = validations[j]
            const { kind } = validation
            properties[kind] = validation.value
            messages[kind] = validation.message
        }

        schema.properties[validatableInput.id] = {
            type: validatableInput.type,
            ...properties
        }

        if (properties.required) {
            schema.required.push(validatableInput.id)
        }

        config.errMessages[validatableInput.id] = messages
    }

    const yupSchema = buildYup(schema, config)
    // const yu = buildYup2(schema, config)
    return yupSchema
}