import Joi from 'joi';

export const configValidationSchema: Joi.ObjectSchema = Joi.object({
  // APP
  APP_NAME: Joi.string().default('sjdiary-backend'),
  APP_PORT: Joi.number().port().default(8000),

  // DATABASE (mysql)
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(3306),
  DB_DATABASE: Joi.string().default('local'),
  DB_USERNAME: Joi.string().default('root'),
  DB_PASSWORD: Joi.string().default(''),

  // TODO
});
