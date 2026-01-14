const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "secret_test";

const authenticateToken = (req, res, next) => {
  // 1. extragem header-ul de autorizare din request
  const authHeader = req.headers['authorization'];
  
  // 2. extragem token-ul din header (formatul este: "Bearer TOKEN")
  const token = authHeader && authHeader.split(' ')[1];

  // 3. daca nu exista token, intoarcem eroare 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ 
      status: 'failed',
      message: 'Token de autentificare lipsește' 
    });
  }

  // 4. verificam daca token-ul este valid
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      // token invalid sau expirat
      return res.status(403).json({ 
        status: 'failed',
        message: 'Token invalid sau expirat' 
      });
    }
    
    // 5. token valid - salvam datele user-ului in request
    // acestea vor fi disponibile in toate controller-ele care urmeaza
    req.user = user; // { id, email }
    
    // 6. continuam catre urmatorul middleware sau controller
    next();
  });
};

module.exports = { authenticateToken };