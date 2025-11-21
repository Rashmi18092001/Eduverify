let JWT_SECRET = '28253c4fdc5c7e6faf4ab149f14161e4a38b5230be4ca4e6fd16ce112644aa2458dcc78522c23cfd6ded5157eabf4a81c0e77ecf3c18620a999fff7a4b4c9d37'
let jwt = require('jsonwebtoken')
let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let path = require('path')

exports.verifyCertificate = async (req, res) => {
    console.log('verifyCertificate', req.query);
    let db = getDB();
    
    try {
        let certificate_id = req.query.certificate_id

        let certificate_data = await db.collection("certificates").findOne({ _id: new ObjectId(certificate_id) })
        if(!certificate_data){
            return res.send({ status: false, message: "Certificate not found" })
        } else{
            if(certificate_data.status == 'active'){
                return res.send({ status: true, message: "Student's certificate is valid!" })
            } else if(certificate_data.status == 'expired'){
                return res.send({ status: true, message: "Student's certificate is expired!" })
            }
        }        
        
    } catch (err) {
        console.log(err);
        res.send({ status: false, message: "Internal Server Error" });
    }

    
}