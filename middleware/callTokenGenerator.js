const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");
const axios = require('axios');

const callTokenGenerator = (req, res, next) => {

    const app_access_key = process.env.APP_ACCESS_KEY;
    const app_secret = process.env.APP_SECRET;

    const payload = {
        access_key: app_access_key,
        type: 'management',
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000)
    };

    jwt.sign(
        payload,
        app_secret,
        {
            algorithm: 'HS256',
            expiresIn: '24h',
            jwtid: uuid4()
        },
        function (err, generatedToken) {
            if (err) {
                res.status(401).json({
                        type: "error",
                        message: "Not able to generate token. Please try again later."
                    }
                )
            } else {
                req.token = generatedToken;
                next();
            }
        }
    );
}

module.exports = callTokenGenerator;
