import express from 'express';
import createHttpError from 'http-errors';
import { JWTAuthentication } from '../authentication/jwt.js';
import UserModel from './schema.js'
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';


const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'users-profile-pics',
        allowedFormats: ['jpg', 'png'],
    }
});



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
                res.send({ accessToken, user });
            } else {
                next(createHttpError(401, "Invalid credentials"));
            }
        } catch (error) {
            next(error);
        }
    })

UserRouter.get("/", async(req, res, next) =>{
    try {
        const user = await UserModel.find()
        res.send(user)
    } catch (error) {
        next()
    }
}
)


UserRouter.put("/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (user) {
            res.send(user);
        } else {
            next(createHttpError(404, "User not found"));
        }
    } catch (error) {
        next(error);
    }

    })
        
        
UserRouter.post("/:id/picture", multer({storage: cloudinaryStorage}).single("user-picture"), async(req, res, next) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndUpdate(
            id, 
            {image:req.file.path}, 
            { new: true }
            );
        if (user) {
            res.send(user);
        } else {
            next(createHttpError(404, "User not found"));
        }
    } catch (error) {
        next(error);
    }   
}
)




    

    
export default UserRouter;
