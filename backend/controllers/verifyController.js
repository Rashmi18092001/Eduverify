let JWT_SECRET = '28253c4fdc5c7e6faf4ab149f14161e4a38b5230be4ca4e6fd16ce112644aa2458dcc78522c23cfd6ded5157eabf4a81c0e77ecf3c18620a999fff7a4b4c9d37'
let jwt = require('jsonwebtoken')
let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let path = require('path')

let qrUrl = process.env.QR_URL;

exports.verifyCertificate = async (req, res) => {
    console.log('verifyCertificate', req.query);
    let db = getDB();
    
    try {
        let certificate_id = req.query.certificate_id

        let certificate_data = await db.collection("certificates").findOne({ _id: new ObjectId(certificate_id) })
        console.log('certificate_data', certificate_data);
        
        if(!certificate_data){
            return res.send({ status: false, message: "Certificate not found" })
        } else{
            if(certificate_data.status == 'active'){
                return res.send({ status: true, message: "Student's certificate is valid!", data: certificate_data.status})
            } else if(certificate_data.status == 'expired' || certificate_data.status == 'revoked'){
                return res.send({ status: true, message: "Student's certificate is Invalid!", data: certificate_data.status })
            }
        }        
        
    } catch (err) {
        console.log(err);
        res.send({ status: false, message: "Internal Server Error" });
    }

    
}

exports.fetchQR = async(req, res) => {
    console.log('fetchQR', req.query);
    let db = getDB();

    try {
        let {certificate_id} = req.query;
        let certificate_data = await db.collection("certificates").findOne({ _id: new ObjectId(certificate_id) })
        console.log('certificate_data', certificate_data);
            
        if(!certificate_data){
            return res.send({ status: false, message: "Certificate not found" })
        } else{
            let qr_image = certificate_data.qr_image
            let qr_url = qrUrl + qr_image

            return res.send({status: true, message: "QR code fetched succesfully", qr_url})
        }
    } catch (error) {
        console.log('error', error);
        
    }
    
}