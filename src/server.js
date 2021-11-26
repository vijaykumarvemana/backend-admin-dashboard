import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import UserRouter from './users/index.js';
import productRouter from "./products/index.js"
import { unauthorizedHandler, forbiddenHandler, catchAllHandler } from "./errorHandlers.js"


const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

// Routes
server.use('/', UserRouter);
server.use('/products', productRouter)

// Error Handlers
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);


// Connect to MongoDB   
console.table(listEndpoints(server));

mongoose.connect(process.env.MONGODB_CONNECTION)
mongoose.connection.on("connected", ()=>{
    console.log("Connected to MongoDB")
    server.listen(port, ()=>{
        console.log(`Server listening on port ${port}`)
    })
})