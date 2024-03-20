import { buildYup } from 'schema-to-yup'
// import { buildYup as buildYup2 } from 'json-schema-to-yup'

export default ({ inputs }) => {

    const schema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {},
        required: [],
    }

    const validatableInputs = inputs.filter(a => (a && a.validation))
    const config = {
        errMessages: {}
    }

    for (var i in validatableInputs) {
        const validatableInput = validatableInputs[i]

        delete validatableInput.validation.messages
        const keys = Object.keys(validatableInput.validation)
        const properties = {}
        const messages = {}

        for (var j in keys) {
            const key = keys[j]
            properties[key] = validatableInput.validation[key].value
            messages[key] = validatableInput.validation[key].message
        }

        schema.properties[validatableInput.id] = {
            type: validatableInput.type,
            ...properties
        }

        if (validatableInput.validation.required) {
            schema.required.push(validatableInput.id)
        }

        config.errMessages[validatableInput.id] = messages
    }

    const yupSchema = buildYup(schema, config)
    // const yu = buildYup2(schema, config)
    return yupSchema
}