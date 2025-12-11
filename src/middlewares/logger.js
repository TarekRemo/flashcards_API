const logger = (req, res, next) => {
    const {method, host} = req;
    const time = new Date().toLocaleTimeString('fr-FR');

    console.log(`[${time}] ${method} request from ${host}`);

    //if it's the last middleware, call res.send() or res.json() instead to end the response
    next();
}

export default logger;