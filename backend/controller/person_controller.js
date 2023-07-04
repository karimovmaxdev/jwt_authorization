const userService = require('../services/user_service');

class PersonController {

    async registartion(req, res, next) {
        try {
            const {email, password} = req.body;
            const newUser = await userService.registration(email, password);
            res.cookie('refreshToken', newUser.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(newUser)

        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData)
            
        } catch (error) {
            next(error)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            res.json(users)
        } catch (error) {
            next(error)
        }
    }
};

module.exports = new PersonController();