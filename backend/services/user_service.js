const db = require('../db');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail_service');
const tokenService = require('./token_service');
const ApiError = require('../exceptions/api-errors');
const { application } = require('express');

class UserService {
    async registration(candidateMail, password) {
        // const {name, surname} = req.body;
        const candidate = await db.query('SELECT * from person WHERE email = $1', [candidateMail]);

        if(candidate.rows[0]) {
            throw ApiError.BadRequest(`User with email: ${candidateMail} is already exist`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const newPerson = await db.query(
            'INSERT INTO person (email, password, activationLink, isActivated) values ($1, $2, $3, $4) RETURNING *', 
            [candidateMail, hashPassword, activationLink, false]
        );

        await mailService.sendActivationMail(candidateMail, `${process.env.BASIC_URL}/API/activate/${activationLink}`); 

        const _userData = newPerson.rows[0];
        const userData = {
            email: _userData.email,
            id: _userData.id,
            isActivated: _userData.isactivated
        };
        const tokens = tokenService.generateTokens({...userData});
        await tokenService.saveToken(userData.id, tokens.refreshToken);

        return {
            ...tokens,
            person: userData
        }
        // res.json(newPerson.rows[0])
    }

    async activate(activationLink) {
        const user = await db.query('SELECT * FROM person WHERE activationlink = $1', [activationLink]);

        if(!user) {
            throw ApiError.BadRequest('not found user by activation link');
        };

        await db.query('UPDATE person set isactivated = $1 WHERE activationlink = $2 RETURNING *', [true, activationLink]);

    }

    async login(email, password) {
        const user = await db.query('SELECT * FROM person WHERE email = $1', [email]);
        if(!user) {
            throw ApiError.BadRequest('login error: this email is not found');
        };

        const _userData = user.rows[0];
        const hashIsEqual = await bcrypt.compare(password, _userData.password);
        if(!hashIsEqual) {
            throw ApiError.BadRequest('login error: password is wrong');
        };

        const userData = {
            email: _userData.email,
            id: _userData.id,
            isActivated: _userData.isactivated
        };
        const tokens = tokenService.generateTokens({...userData});
        await tokenService.saveToken(userData.id, tokens.refreshToken);

        return {
            ...tokens,
            person: userData
        }
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb) {
            throw ApiError.UnathorizedError();
        }

        const user = await db.query('SELECT * FROM person WHERE id = $1', [userData.id]);

        const _userDataFromDb = user.rows[0];
        const userDataFromDb = {
            email: _userDataFromDb.email,
            id: _userDataFromDb.id,
            isActivated: _userDataFromDb.isactivated
        };

        const tokens = tokenService.generateTokens({...userDataFromDb});
        await tokenService.saveToken(userDataFromDb.id, tokens.refreshToken);

        return {
            ...tokens,
            person: userDataFromDb
        }


    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async getUsers() {
        const users = await db.query('SELECT * FROM person');
        return users.rows;
    }
};

module.exports = new UserService();