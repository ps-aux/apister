import joi from 'joi'

export const string = () => joi.string()

export const number = () => joi.number()

export const decimal = number

export const boolean = () => joi.boolean()

export const arrayOf = type => joi.array().items(type)

export const isoDate = () => joi.date().iso()

export const optional = type => [type, null]

export const enm = (...vals) => joi.any().valid(...vals)
