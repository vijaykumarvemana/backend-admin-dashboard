import express from 'express';
import createHttpError from 'http-errors';
import { JWTAuthentication } from '../authentication/jwt.js';
import UserModel from './schema.js'


const UserRouter = express.Router();

UserRouter.post("/register", async(req, res, next) => {
    try {
        const nweUser = new UserModel(req.body);
        const { _id } = await nweUser.save();
        res.send({ _id });
    } catch (error) {
        next(error);
    }
    })
    
UserRouter.post("/login", async(req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.checkCredentials(email, password);
            if (user) {
                const accessToken = await JWTAuthentication(user)
                res.send({ accessToken });
            } else {
                next(createHttpError(401, "Invalid credentials"));
            }
        } catch (error) {
            next(error);
        }
    })

    
export default UserRouter;
