const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional()
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(100).required()
  })
};

// Recipe validation schemas
const recipeSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    ingredients: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().positive().required(),
        unit: Joi.string().required(),
        notes: Joi.string().optional()
      })
    ).min(1).required(),
    instructions: Joi.array().items(Joi.string()).min(1).required(),
    prepTime: Joi.number().integer().min(0).optional(),
    cookTime: Joi.number().integer().min(0).optional(),
    servings: Joi.number().integer().min(1).optional(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
    cuisine: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    image: Joi.string().uri().optional(),
    isPublic: Joi.boolean().optional(),
    isPublished: Joi.boolean().optional()
  }),
  
  update: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    ingredients: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().positive().required(),
        unit: Joi.string().required(),
        notes: Joi.string().optional()
      })
    ).min(1).optional(),
    instructions: Joi.array().items(Joi.string()).min(1).optional(),
    prepTime: Joi.number().integer().min(0).optional(),
    cookTime: Joi.number().integer().min(0).optional(),
    servings: Joi.number().integer().min(1).optional(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
    cuisine: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    image: Joi.string().uri().optional(),
    isPublic: Joi.boolean().optional(),
    isPublished: Joi.boolean().optional()
  }),
  
  rate: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// GraphQL validation helper
const validateGraphQL = (schema, input) => {
  const { error } = schema.validate(input);
  if (error) {
    throw new Error(`Validation Error: ${error.details.map(detail => detail.message).join(', ')}`);
  }
  return input;
};

module.exports = {
  userSchemas,
  recipeSchemas,
  validate,
  validateGraphQL
};
