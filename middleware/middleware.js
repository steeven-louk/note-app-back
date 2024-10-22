const jwt = require("jsonwebtoken");
const User = require("../models/User");

const middleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Vérifier si le header Authorization existe et contient un token
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized, no token provided" });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized, token is missing" });
        }

        // Décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier si le token a été décodé avec succès
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        // Rechercher l'utilisateur dans la base de données par ID décodé
        const user = await User.findById(decoded.user.id);
        
        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ajouter les informations utilisateur dans la requête
        req.user = { username: user.username, id: user._id };

        // Passer au middleware ou à la route suivante
        next();
    } catch (error) {
        console.error("Error in auth middleware: ", error);
        return res.status(500).json({ success: false, message: "Server error, please login again" });
    }
};


module.exports = middleware;
