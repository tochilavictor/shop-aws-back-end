import Joi from 'joi';

export interface ImportFilePayload {
  name: string;
}

export const ImportFileSchema = Joi.object({
  name: Joi.string().required(),
});
