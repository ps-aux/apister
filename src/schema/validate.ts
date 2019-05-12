import joi from 'joi'

export const validateAgainstSchema = (obj, schema) => {
    if (!obj)
        return new Error('No value to validate. Maybe HTTP response is empty?')
    const res = joi.validate(obj, schema, {
        allowUnknown: true,
        presence: 'required',
        abortEarly: false // All errors
    })

    return res.error
}
