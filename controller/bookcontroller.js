import Booktable from "../model/book.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs"
import Jwt from "jsonwebtoken";
import multer from "multer";
import APP_STATUS from "../constants/constants.js";
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'upload_image');
    },
    filename: function (request, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".jpg");
    }
});

export const upload = multer({ storage: storage });


export const Addbook = async (request, response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(200).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.array()
        });
    }

    try {
        let { Bookname, AutherName, Bookversion, price, pages, password, email, image } = request.body;

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        let chekbookname = await Booktable.findOne({ Bookname: Bookname });
        if (chekbookname) {
            return response.status(200).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "Bookname is Already exits"
            });
        }
        let thebookobj = {
            Bookname: Bookname,
            AutherName: AutherName,
            Bookversion: Bookversion,
            price: price,
            pages: pages,
            password: hashpassword,
            email: email,
            image: request.file.filename
        };

        thebookobj = await new Booktable(thebookobj).save();
        if (thebookobj) {
            return response.status(200).json({
                msg: "Book Updated",
                data: thebookobj
            });
        }
    }
    catch (error) {
        return response.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
};

export const loginbook = async (request, response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(200).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.array()
        });
    }
    try {
        let { email, password } = request.body;

        let thebookobj = await Booktable.findOne({ email: email });
        if (!thebookobj) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "invalid email"
            });
        }

        let ismatch = await bcryptjs.compare(password, thebookobj.password)
        if (!ismatch) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                error: "invalid password"
            });
        }

        let secretkey = process.env.JWT_SECRET_KEY;

        let payload = {
            _id: thebookobj._id,
            Bookname: thebookobj.Bookname,
            AutherName: thebookobj.AutherName,
            Bookversion: thebookobj.Bookversion,
            price: thebookobj.price,
            pages: thebookobj.pages,
            email: thebookobj.email,
            password: thebookobj.password,
            image: thebookobj.image
        };
        if (payload && secretkey) {
            Jwt.sign(payload, secretkey, {
                expiresIn: 9809890
            }, (error, encoded) => {
                if (error) throw error;
                if (encoded) {
                    return response.status(200).json({
                        status: APP_STATUS.SUCCESS,
                        msg: "Login SuccessFully",
                        data: thebookobj,
                        token: encoded
                    });
                }
            });
        }
    }
    catch (error) {
        return response.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
};
export const getbook = async (request, response) => {
    try {
        let Book = await Booktable.find();
        if (Book) {
            return response.status(200).json(Book);
        }
    }
    catch (error) {
        return response.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message,

        });
    }
};

// export const singlebook = async (request, response) => {
//     try {
//         const { _id, Bookname } = request.query;
//         if (_id) {
//             const book = await Booktable.findOne({ _id });
//             if (!book) {
//                 return response.status(404).json({
//                     data: null,
//                     error: "Book Not Found"
//                 });
//             }
//             return response.status(200).json(book);

//         } else if (Bookname) {
//             const book = await Booktable.findOne({ Bookname });
//             if (!book) {
//                 return response.status(404).json({
//                     data: null,
//                     error: "Book Not Found"
//                 });
//             }
//             return response.status(200).json(book);
//         } else {
//             return response.status(400).json({
//                 data: null,
//                 error: "Missing required parameters"
//             });
//         }
//     } catch (error) {
//         return response.status(500).json({
//             data: null,
//             error: error.message
//         });
//     }
// };

export const singlebook = async (request, response) => {
    try {
        const { _id, Bookname } = request.query
        if (_id || Bookname) {
            const book = await Booktable.findOne({ _id } || { Bookname })
            if (!book) {
                return response.status(404).json({
                    status: APP_STATUS.FAILED,
                    data: null,
                    error: "Book not found"
                })
            }
            return response.status(200).json(book)
        } else {
            return response.status(500).json({
                data: null,
                error: "Missing required parameter"
            })
        }
    } catch (error) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        })
    }
}

export const updatebook = async (request, response) => {
    let { bookid } = request.params;
    try {
        let { _id, Bookname, AutherName, Bookversion, price, pages, password, email, image } = request.body;

        const mongobookid = new mongoose.Types.ObjectId(bookid);
        const book = await Booktable.findById(mongobookid);

        if (!book) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "Book Not Found"
            });
        }
        let thebookobj = {
            _id: _id,
            Bookname: Bookname,
            AutherName: AutherName,
            Bookversion: Bookversion,
            price: price,
            pages: pages,
            password: password,
            email: email,
            image: image
        };
        thebookobj = await Booktable.findByIdAndUpdate(mongobookid, { $set: thebookobj }, { new: true });
        if (thebookobj) {
            return response.status(200).json({
                msg: "Book Updated",
                data: thebookobj
            });
        }
    }
    catch (error) {
        return response.status(200).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
};

export const deletebook = async (request, response) => {
    try {
        let { bookid } = request.params;
        if (bookid) {
            const mongobookid = new mongoose.Types.ObjectId(bookid);
            const book = await Booktable.findById(mongobookid);

            if (!book) {
                return response.status(400).json({
                    status: APP_STATUS.FAILED,
                    data: null,
                    msg: "Book not Found"
                });
            }

            var pathh = path.join(__dirname, `../upload_image/${book.image}`);
            fs.unlink(pathh, (err, result) => {
                console.log("comming");
                if (err) {
                    console.log(err);
                } else {
                    console.log("yes");
                }
            });

            let thebookobj = await Booktable.findByIdAndDelete(mongobookid)
            if (thebookobj) {
                return response.status(200).json({
                    status: APP_STATUS.SUCCESS,
                    data: null,
                    msg: "Book SuccessFully Deleted...!"
                });
            }
        }
    } catch (error) {
        return response.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            error: error.message
        });
    }
}

export const getUsersData = async (request, response) => {

};
