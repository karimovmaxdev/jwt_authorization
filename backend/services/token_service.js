const db = require('../db');
const jwt = require('jsonwebtoken');


class tokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {accessToken, refreshToken}
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId, refresh) {
        const tokenData = await db.query('SELECT * from token WHERE person_id = $1', [userId]);

        if(tokenData.rows[0]) {
            const tokenInfo = await db.query('UPDATE token SET refreshtoken = $1 WHERE person_id = $2 RETURNING *', [refresh, userId]);
            return tokenInfo.rows[0];
        };

        const newToken = await db.query('INSERT INTO token (person_id, refreshtoken) values ($1, $2) RETURNING *', [userId, refresh]);
        return newToken.rows[0];
    }

    async removeToken(refreshToken) {
        const tokenData = await db.query('DELETE FROM token WHERE refreshToken = $1', [refreshToken]);
        return tokenData.rows[0]
    }

    async findToken(refreshToken) {
        const tokenData = await db.query('SELECT token FROM token WHERE refreshToken = $1', [refreshToken]);
        return tokenData.rows[0]
    }
};

module.exports = new tokenService()