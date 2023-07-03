import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import BookRouter from './router/BookRouter.js';
import mongoose from "mongoose";
import bodyparser from "body-parser";


dotenv.config({
    path: "./.env"
});

const app = express();
const port = process.env.PORT || 7654;
const DbUrl = process.env.DB_URL_NAME;


mongoose.connect(DbUrl).then(() => {
    console.log("mongoDB connection SuccessFully..!!!");
}).catch(error => {
    console.log("mongodb connection Failed");
})

app.get("/", (request, response) => {
    return response.status(200).json({
        msg: "Server Has Been Started...!"
    });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "./upload_image")

app.use(express.json());
app.use(bodyparser.json())
app.use(express.static(publicPath));
app.use(bodyparser.urlencoded({extended:true}))
app.use("/upload_image",express.static(publicPath))
app.use("/book", BookRouter);

app.listen(port, () => {
    console.log(`Server Has Been Started at http://localhost:${port}`);
})


