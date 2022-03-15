const authorModel = require("../models/authorModel")
const jwt = require('jsonwebtoken')



const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
        } else {
            let createdAuthor = await authorModel.create(data)
            res.status(201).send({ data: createdAuthor })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }

}

const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        if (!(email && password)) {
            res.status(400).send({ status: false, msg: "email & password is required, BAD REQUEST" })
        }
        let authorDetails = await authorModel.findOne({ email: email, password: password })
        if (!authorDetails)
            res.status(404).send({ status: false, msg: "email & password not matched" })

            let secret = 'secret';
            let token = jwt.sign({
                authorId: authorDetails._id.toString(),
                batch:"thorium",
                project: "Phase 2",
         },
         secret, {
             expiresIn: "1hr"
         },
          "Thorium Phase2"
          );
            res.setHeader("x-api-key", token);
            res.status(201).send({ status: true, data: token })
       
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor