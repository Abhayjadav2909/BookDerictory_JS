import jwt from 'jsonwebtoken';

export const tokenverify = async (request, response, next) => {
    try {

        let secretkey = process.env.JWT_SECRET_KEY;
        if (secretkey) {
            let token = request.headers["auth-token"];
            if (!token) {
                return response.status(401).json({
                    msg: 'No Token Provided!'
                });
            }
            if (typeof token === "string" && secretkey) {
                let decodeObj = await jwt.verify(token, secretkey);
                next();
                console.log(decodeObj);
                if (decodeObj)      {
                    return response.status(200).json({
                        msg: " A Valid token",
                        data: decodeObj
                    })
                }
            } else {
                return response.status(401).json({
                    msg: 'An Invalid Token!'
                });
            }
        }
    } catch (error) {
        return response.status(500).json({
            msg: 'Unauthorized!, its an invalid token'
        });
    }
}
