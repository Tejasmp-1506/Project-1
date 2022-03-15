const { count } = require("console")
const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")
const AuthorModel= require("../models/authorModel")

const createAuthor= async function (req, res) {
    try{
        let author = req.body
        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({data: authorCreated})
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }  
};


const loginAuthor = async function(req,res) {
    try{
        let authorName = req.body.email;
        let password = req.body.password;
        
        let author = await authorModel.findOne({ email: authorName, password: password });
        if(!author)
        res.status(400).send({status: false,msg: "username or the password is not correct" });
        
        let token = jwt.sign(
        {
          authorId: author._id.toString(),
          batch: "thorium",
          project: "Phase 2",
        },
        "Phase2-thorium"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, data: token });
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor