const ApiError = require('../exceptions/api-errors');
const tokenService = require('../services/token_service');

module.exports = function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) next(ApiError.UnathorizedError());

        const accessToken = authHeader.split(' ')[1];
        if(!accessToken) next(tApiError.UnathorizedError());

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) next(ApiError.UnathorizedError());

        req.user = userData;
        next()

    } catch (error) {
        return next(ApiError.UnathorizedError());
    }
}