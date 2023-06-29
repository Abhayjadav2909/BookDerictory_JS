import express ,{ request ,response } from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import  BookRouter  from './router/BookRouter.js';
import mongoose from "mongoose";
import bodyparser from "body-parser";

const app = express();

dotenv.config({
    path: "./.env"
});

const port = process.env.PORT || 7654;
const DbUrl = process.env.DB_URL_NAME;

mongoose.connect(DbUrl).then(() => {
    console.log("mongoDB connection SuccessFully..!");
}).catch(error => {
    console.log("mongodb connection Failed");
})
app.get("/", (request, response) => {
    return response.status(200).json({
        msg: "Server Has Been Started...!"
    });
});
app.use(express.json());
app.use(bodyparser.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "./upload_image")

app.use(express.static(publicPath));    //for a save static file
console.log(publicPath);

app.use("/book", BookRouter );


app.listen(port, () => {
    console.log(`server has been started at http://localhost:${port}`);
})



