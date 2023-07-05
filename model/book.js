import mongoose from "mongoose"


const Bookschema = new mongoose.Schema({
    Bookname: { type: String, required: true },
    AutherName: { type: String, required: true },
    Bookversion: { type: String, required: true },
    price: { type: Number, required: true },
    pages: { type: Number, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    images: { type: [String], required: true },
})
const Booktable = mongoose.model("Books", Bookschema)


export default Booktable
// https://www.canva.com/design/DAFnw1yvIAs/wHX30HbrpVn8-YcJjr16cw/edit?utm_content=DAFnw1yvIAs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

// Image URL
// http://localhost:1245/image-1687501136432.jpg