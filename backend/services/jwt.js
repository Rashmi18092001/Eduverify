const jwt = require('jsonwebtoken');
let ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;
 
module.exports = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: 'Access token missing'
    });
  }
  
  try {
    const payload = jwt.verify(token, ACCESSTOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};