const jwt = require('jsonwebtoken');
const User = require('./login/model');

module.exports.verify = async (req, res, next) => {
  try {
    let token = req.cookies['auth-token'];

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: 0,
          error: 'Invalid token',
        });
      }
      req.user = decoded.data;
      next();
    });
  } catch (error) {
    res.status(403).json({
      error: 'Unauthorized',
      errorReturned: error,
    });
  }
};

module.exports.verifyAdmin = async (req, res, next) => {
  try {
    let token = req.cookies['auth-token'];

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: 0,
          error: 'Invalid token',
        });
      }
      req.user = decoded.data;

      const id = await User.findOne({ _id: decoded.data, role: 2 });
      if (!id) throw new Error();
      next();
    });
  } catch (error) {
    return res.status(403).json({
      success: 0,
      error: 'Unauthorized',
      errorReturned: error,
    });
  }
};
