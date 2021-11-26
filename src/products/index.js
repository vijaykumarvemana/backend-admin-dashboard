import express from 'express'
import createHttpError from 'http-errors'
import ProductModel from './schema.js'
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
        folder: 'products-images',
        allowedFormats: ['jpg', 'png'],
    }
});



const productRouter = express.Router()

productRouter.post("/", async(req, res, next)=>{
    try {
        const newProduct = new ProductModel(req.body)
        const {_id} = await newProduct.save()
        res.send({_id})
        
    } catch (error) {
       next(error) 
    }
})

productRouter.get("/", async(req,res,next) =>{
    try {
        const products = await ProductModel.find()
        res.send(products)
    } catch (error) {
        next(error)
    }
})

productRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const products = await ProductModel.findById(id);

    if (products) {
      res.send(products);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedProduct = await ProductModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (modifiedProduct) {
      res.send(modifiedProduct);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});


productRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `product with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});


productRouter.post("/:id/image", multer({storage: cloudinaryStorage}).single("product-image"), async(req, res, next) => {
    try {
        const id = req.params.id;
        const product = await ProductModel.findByIdAndUpdate(
            id, 
            {image:req.file.path}, 
            { new: true }
            );
        if (product) {
            res.send(product);
        } else {
            next(createHttpError(404, "product not found"));
        }
    } catch (error) {
        next(error);
    }   
}
)


export default productRouter