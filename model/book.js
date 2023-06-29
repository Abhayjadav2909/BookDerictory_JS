import mongoose from "mongoose"


const Bookschema = new mongoose.Schema({
    Bookname: { type: String, required: true },
    AutherName: { type: String, required: true },
    Bookversion: { type: String, required: true },
    price: { type: Number, required: true },
    pages: { type: Number, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },

})
const Booktable = mongoose.model("Books", Bookschema)


export default Booktable


// Image URL
// http://localhost:1245/image-1687501136432.jpg