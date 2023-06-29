import express  from 'express';
const BookRouter = express.Router();
import { body } from "express-validator";
import { loginbook, getUsersData, deletebook, updatebook, singlebook, getbook, Addbook } from "../controller/bookcontroller.js"
import {tokenverify} from "../middleware/tokenverify.js"
import { upload } from '../controller/bookcontroller.js';


// BookRouter.post("/single", upload.single("image"), (request, response) => {
//     console.log(request);
//     response.send("file upload ");
// });


BookRouter.post("/register", upload.single("image"), [
    body("Bookname").not().isEmpty().withMessage("Bookname is Required"),
    body("AutherName").not().isEmpty().withMessage("AutherName is Required"),
    body("Bookversion").not().isEmpty().withMessage("Bookversion is Required"),
    body("price").not().isEmpty().withMessage("price is Required"),
    body("pages").not().isEmpty().withMessage("pages is Required"),
    body("password").not().isEmpty().withMessage("password is Required"),
    body("email").not().isEmpty().withMessage("email is Required"),
    // body("image").not().isEmpty().withMessage("image is Required"),
], async (request, response) => {
    await Addbook(request, response);
});

BookRouter.post("/login", [
    body("password").not().isEmpty().withMessage("password is Required"),
    body("email").not().isEmpty().withMessage("email is Required"),
], async (request, response) => {
    await loginbook(request, response);
});

BookRouter.get("/", async (request, response) => {
    console.log("request");
    await getbook(request, response);
});

BookRouter.get("/search", async (request, response) => {
    await singlebook(request, response);
});

BookRouter.put("/:bookid", async (request, response) => {
    await updatebook(request, response);
});

BookRouter.delete("/:bookid", async (request, response) => {
    await deletebook(request, response);
});

BookRouter.get("/token",tokenverify,async(request , response)=>{
    await getUsersData(request, response)
})



export default BookRouter
