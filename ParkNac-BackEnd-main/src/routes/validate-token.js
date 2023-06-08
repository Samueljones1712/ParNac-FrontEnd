const { Request, Response, NextFunction } = require("express");
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    console.log("validate token");
    const headerToken = req.headers['authorization']
    console.log(headerToken);

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {

        //jwt.verify()
        try {

            const bearerToken = headerToken.slice(7);

            console.log(bearerToken);

            jwt.verify(bearerToken, process.env.SECRET_KEY || 'pepito123');

            next()
        } catch (error) {

            res.status(401).json({
                msg: "Token no valido"
            })

        }


    } else {
        res.status(401).json({
            msg: "Acceso denegado"
        })
    }

};

module.exports = validateToken;
