import express from 'express';
import createHttpError from 'http-errors';
import CustomerModel  from "../customers/schema.js";
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
        folder: 'customers-images',
        allowedFormats: ['jpg', 'png'],
    }
});


const customerRouter = express.Router();


customerRouter.get('/', async(req, res, next) => {
    try {
        const customers = await CustomerModel.find()
        res.send(customers);
    } catch (err) {
        next(err);
    }
})
customerRouter.get('/users-count', async(req, res, next) => {
    try {
        const customers = await CustomerModel.aggregate([{
            $match: {
              createdAt: {
                $gte: new Date("2021-01-01")
              } 
            } 
          }, { 
            $group: {
              _id: { 
                "year":  { "$year": "$createdAt" },
                "month": { "$month": "$createdAt" },
                "day":   { "$dayOfMonth": "$createdAt" }
              },
              count:{$sum: 1}
            }
          }]).exec(function(err,data){
            if (err) {
              console.log('Error Fetching model');
              console.log(err);
            } else {
              res.send(data.map(item => { item.date = (item._id.year, item._id.month, item._id.day); return item; }));
            }
            });


       
    } catch (err) {
        next(err);
    }
})

        


customerRouter.post('/', async(req, res, next) => {
    try {
        const customer = await CustomerModel(req.body);
       const { _id } = await customer.save();
         res.send({ _id });
    } catch (err) {
        next(err);
    }
})

customerRouter.get('/:id', async(req, res, next) => {
    try {
        const customer = await CustomerModel.findById(req.params.id);
        if (!customer) {
            throw createHttpError(404, 'Customer not found');
        }
        res.send(customer);
    } catch (err) {
        next(err);
    }
}   )

customerRouter.put('/:id', async(req, res, next) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, req.body);
        if (!customer) {
            throw createHttpError(404, 'Customer not found');
        }
        res.send(customer);
    } catch (err) {
        next(err);
    }
})

customerRouter.delete('/:id', async(req, res, next) => {
    try {
        const customer = await CustomerModel.findByIdAndDelete(req.params.id);
        if (!customer) {
            throw createHttpError(404, 'Customer not found');
        }
        res.send(customer);
    } catch (err) {
        next(err);
    }
})

customerRouter.post("/:id/avatar",multer({storage: cloudinaryStorage}).single("customer-image"), async(req, res, next) => {
    try {
        const id = req.params.id;
        const customer = await CustomerModel.findByIdAndUpdate(
            id,
            {avatar: req.file.path},
            {new: true});
        if (!customer) {
            throw createHttpError(404, 'Customer not found');
        }
        res.send(customer);
    } catch (err) {
        next(err);
    }
})


export default customerRouter;
        
        
        





