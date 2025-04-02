const jwt = require('jsonwebtoken');

const checkRoles = (roles) => {
    const secret = process.env.SECRET || "YOUR_SECRET";

    return (req, res, next) => {
        try {
            
            if (!req.headers.authorization) {
                return res.status(401).json({ message: "Authorization header missing" });
            }

           
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Token missing" });
            }

            
            const decoded = jwt.verify(token, secret);
            
            const {object:{role}} = decoded
            req.user= {
                username: decoded.object.userename,
                role: role,
            };

            

            
            if (!roles.includes(role)) {

               

                return res.status(403).json({ message: "Insufficient authorization" });
                
            }

            
                return next();

            
        } catch (error) {

            console.error("Authorization error:", error.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};

module.exports = { checkRoles };