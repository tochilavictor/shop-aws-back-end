import Joi from "joi";

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  count: number;
}

export const ProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().positive().required(),
  count: Joi.number().min(0).required(),
});
