import Joi from "joi";

const messageSchema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().disallow(Joi.ref("from")).required(),
    text: Joi.string().required(),
    type: Joi.string().valid("message", "private_message").required(),
});

export { messageSchema };
