const jwt = require("jsonwebtoken");
const config = require("../config");

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Hardcoded user credentials for simplicity (you can replace with DB query)
    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: "1h" });
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, config.jwtSecret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};
