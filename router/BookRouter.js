import express, { Router }  from 'express';
// const BookRouter = express.Router();
import { body } from "express-validator";
import { loginbook, getUsersData, deletebook, updatebook, singlebook, getbook, Addbook } from "../controller/bookcontroller.js"
import {tokenverify} from "../middleware/tokenverify.js"
import { upload } from '../controller/bookcontroller.js';



const BookRouter = Router()

// API = POST
// URL = http://localhost:1245/book/register
BookRouter.post("/register", upload.single("image"), [
    body("Bookname").not().isEmpty().withMessage("Bookname is Required"),
    body("AutherName").not().isEmpty().withMessage("AutherName is Required"),
    body("Bookversion").not().isEmpty().withMessage("Bookversion is Required"),
    body("price").not().isEmpty().withMessage("price is Required"),
    body("pages").not().isEmpty().withMessage("pages is Required"),
    body("password").not().isEmpty().withMessage("password is Required"),
    body("email").not().isEmpty().withMessage("email is Required")
], async (request, response) => {
    await Addbook(request, response);
});


// API = POST
// URL = http://localhost:1245/book/login
BookRouter.post("/login", [
    body("password").not().isEmpty().withMessage("password is Required"),
    body("email").not().isEmpty().withMessage("email is Required"),
], async (request, response) => {
    await loginbook(request, response);
});

// API = GET
// URL = http://localhost:1245/book
BookRouter.get("/", async (request, response) => {
    await getbook(request, response);
});

// API = GET
// URL = http://localhost:1245/book/serach
BookRouter.get("/search", async (request, response) => {
    await singlebook(request, response);
});

// API = PUT
// URL = http://localhost:1245/book/objectId
BookRouter.put("/:bookid", async (request, response) => {
    await updatebook(request, response);
});

// API = DELETE
// URL = http://localhost:1245/book/objectId
BookRouter.delete("/:bookid", async (request, response) => {
    await deletebook(request, response);
});

// API = GET
// URL = http://localhost:1245/book/token
BookRouter.get("/token",tokenverify,async(request , response)=>{
    await getUsersData(request, response)
})

export default BookRouter
