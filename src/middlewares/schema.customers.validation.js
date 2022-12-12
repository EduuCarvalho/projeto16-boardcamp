import joi from "joi";

export const customersSchema = joi.object({
    name:joi.string().required(),
    phone:joi.number().required(),
    cpf:joi.number().required(),
    birthday:joi.date().required()
})

export function schemaCustomersValidation (req,res,next){
    const {name,phone,cpf,birthday} = req.body;
    const {error} = customersSchema.validate ({name,phone,cpf,birthday},{abortEarly:false});
    if(error){
        const errors = error.details.map((details)=>details.message);
        return res.status(422).send(errors);
    }

    next();
}
