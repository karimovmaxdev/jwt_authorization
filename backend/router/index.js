const Router = require('express').Router;
const personController = require('../controller/person_controller');
const authMiddleware = require('../middleware/auth-middleware')

const router = Router();
router.post('/register', personController.registartion);
router.post('/login', personController.login);
router.post('/logout', personController.logout);
router.get('/activate/:link', personController.activate);
router.get('/refresh', personController.refresh);
router.get('/users', authMiddleware, personController.getUsers);

module.exports = router;