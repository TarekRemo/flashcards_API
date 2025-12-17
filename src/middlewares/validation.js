export const validateBody = (schema) => {
    return (req, res, next) => {
        try{
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            return res.status(400).send({ error: "Invalid request body" });
        }

    };
}

export const validateParams = (schema) => {
    return (req, res, next) => {
        try{
            req.body = schema.parse(req.params);
            next();
        }
        catch (err) {
            return res.status(400).send({ error: "Invalid request parameters" });
        }
    };
}