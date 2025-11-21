const jwt = require('jsonwebtoken');
let JWT_SECRET = '28253c4fdc5c7e6faf4ab149f14161e4a38b5230be4ca4e6fd16ce112644aa2458dcc78522c23cfd6ded5157eabf4a81c0e77ecf3c18620a999fff7a4b4c9d37'
 
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};