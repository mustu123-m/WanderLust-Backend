const Joi = require('joi');

const ListingSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.object({
    filename: Joi.string(),
    url: Joi.string().allow('', null)
  }),
  price: Joi.number().required().min(0),
  category: Joi.string()
  .valid(
    "apartment",
    "house",
    "villa",
    "hotel",
    "camping",
    "beach",
    "mountain",
    "farm",
    "luxury",
    "city",
    "treehouse",
    "lake",
    "cabin",
    "heritage"
  )
  .required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    Address: Joi.string().required()
  }),
  country: Joi.string().required()
}).required().unknown(true);

const ReviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
  }).required()
}).required();

module.exports = {
  ListingSchema,
  ReviewSchema
};
