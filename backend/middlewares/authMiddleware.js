const jwt = require('jsonwebtoken');
const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;

const authMiddleware = (req, res, next) => {

    // const authHeader = req.headers.authorization

    // if(!authHeader){
    //     res.send({status: false, message: "No token"})
    // }

    // const token = authHeader.split(" ")[1];
    const token = req.cookies.accessToken
    if(!token){
        res.send({status: false, message: "No token"})
    }

    try {
        const decoded = jwt.verify(token, ACCESSTOKEN_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (error) {
        return res.send({ status: false, message: "Invalid token" });
    }
}