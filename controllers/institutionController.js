let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let fs = require('fs')
let path = require('path')


let profileUrl = process.env.PROFILE_URL;
let logoUrl = process.env.LOGO_URL;
let pdfUrl = process.env.PDF_URL;
let qrUrl = process.env.QR_URL;

//add key to change image
exports.editInstitution = async (req, res) => {
    console.log('editInstitution', req.body);

    try {
        let db = getDB()
        let { id, email, password, phone, institutionName, institutionCode, institution_logo } = req.body 
        let inst_obj = {}
        let user_obj = {}

        let inst_data = await db.collection("institution").findOne({ _id: new ObjectId(id) })
        if(!inst_data){
            return res.send({ status: false, message: "Institution not found" })
        }

        let user_id = inst_data.user_id
        inst_obj.user_id = user_id

        if(institutionName){
            inst_obj.institutionName = institutionName
        }
        if(institutionCode){
            inst_obj.institutionCode = institutionCode
        }
        if(typeof institution_logo === "object"){
            if(inst_data.institution_logo != ""){

                let oldImagePath = `./logos/${inst_data.institution_logo}`
                if(fs.existsSync(oldImagePath)){
                    try{
                        fs.unlinkSync(oldImagePath)
                        console.log('Image deleted: ', oldImagePath);
                    } catch(err) {
                        console.log('Error deleting logo: ', err);
                    }
                }

                let file_name = institution_logo.file_name.split(".")[0]
                let ext = institution_logo.file_name.split(".")[1]
                const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
                let upload_name = `${file_name}_${randomNumber}.${ext}`
                if (!fs.existsSync("./logos"))
                    fs.mkdirSync("./logos");
                            
                const outputFile = `./logos/${upload_name}`;
            
                if (institution_logo.baseString) {
                    const base64Data = institution_logo.baseString.replace(/^data:.+;base64,/, "");
            
                    fs.writeFileSync(outputFile, base64Data, "base64");
                    console.log("File saved at:", outputFile);
                    
                    inst_obj.institution_logo = upload_name

                    // institution_logo = upload_name;
                } else {
                        console.log("❌ ERROR: Base64 data missing!");
                    }
            } 
            else{
                let file_name = institution_logo.file_name.split(".")[0]
                let ext = institution_logo.file_name.split(".")[1]
                const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
                let upload_name = `${file_name}_${randomNumber}.${ext}`
                if (!fs.existsSync("./logos"))
                    fs.mkdirSync("./logos");
                            
                const outputFile = `./logos/${upload_name}`;
            
                if (institution_logo.baseString) {
                    const base64Data = institution_logo.baseString.replace(/^data:.+;base64,/, "");
            
                    fs.writeFileSync(outputFile, base64Data, "base64");
                    console.log("File saved at:", outputFile);
                    
                    inst_obj.institution_logo = upload_name

                } else {
                        console.log("❌ ERROR: Base64 data missing!");
                    }
                }        
        }            
        
        await db.collection("institution").updateOne({ _id: new ObjectId(id) }, {$set: inst_obj })
        
        let user_data = await db.collection("users").findOne({ _id: new ObjectId(user_id) })
        if(!user_data){
            return res.send({ status: false, message: "User data not found" })
        } else{
            if(email){
                user_obj.email = email
            }
            if(password){
                user_obj.password = password
            }
            if(phone){
                user_obj.phone = phone
            }
            await db.collection("users").updateOne({ _id: new ObjectId(user_id) }, {$set: user_obj})
            return res.send({ status: true, message: "Institution details updated successfully" })

        }
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    } 
}

exports.InstStats = async (req, res) => {
    console.log('InstStats', req.query);
    let db = getDB()

    try {
        let id = req.query.id 
        let data = await db.collection("institution").findOne({ _id: new ObjectId(id) })
        if(!data){
            return res.send({ status: false, message: "Data not found" })
        } else{
            let total_students = await db.collection("students").count({ institution_id: id })
            let expired_students = await db.collection("students").count({ institution_id: id, status: "expired" })
            let revoked_students = await db.collection("students").count({ institution_id: id, status: "revoked" })
            let active_students = await db.collection("students").count({ institution_id: id, status: "active" })
            
            let logo = data.institution_logo
            if(logo && logo != ""){
                data.institution_logo = logoUrl + logo
            }
            data.total_students = total_students
            data.expired_students = expired_students
            data.revoked_students = revoked_students
            data.active_students = active_students

            return res.send({ status: true, message: "Data found sucessfully", data: data })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }   
    
}