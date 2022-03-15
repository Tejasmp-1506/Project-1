const jwt = require("jsonwebtoken");

let authenticate= function (req,res,next){
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            res.status(401).send({ status: false, msg: " token must be present" })
        }

        let decodedToken = jwt.verify(token, "Phase2-thorium")
        if (!decodedToken) {
            return res.status(401).status({ status: false, msg: "token is invalid" })
        }
        next()
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
    }

    let authorise= function (req,res,next){
        try{
            let authorId=req.params.authorId
            let token = req.headers["x-api-key"]
            if(!authorId) {
                res.status(400).send({status: false, msg: " authorId is required, BAD REQUEST"})
            }
    
            let decodedToken = jwt.verify(token, "Phase2-thorium")
            if(decodedToken.authorId != authorId){
                return res.status(403).send({status:false,msg:"you are not authorized"})
            }
            next()
        }
        catch (err) {
            console.log("This is the error :", err.message)
            res.status(500).send({ msg: "Error", error: err.message })
        }
    }
    

module.exports.authenticate = authenticate
module.exports.authorise = authorise

