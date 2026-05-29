let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let fs = require('fs')
let path = require('path')
const QRCode = require('qrcode')
const {uploadOnCloudinary} = require('../utils/cloudinary')


let qrPath = process.env.QR_PATH;
let profileUrl = process.env.PROFILE_URL;
let logoUrl = process.env.LOGO_URL;
let pdfUrl = process.env.PDF_URL;
let qrUrl = process.env.QR_URL;

//add key to change image
exports.editInstitution = async (req, res) => {
    console.log('editInstitution', req.body);
    console.log('editInstitution', req.files);
    
    try {
        let user = req.user;
        let user_id = user.id

        let db = getDB()
        let {institution_logo} = req.files
        let { email, phone, institutionName, institutionCode } = req.body 
        let inst_obj = {}
        let user_obj = {}

        let inst_data = await db.collection("institution").findOne({user_id})
        if(!inst_data){
            return res.send({ status: false, message: "Institution not found" })
        }

        // let user_id = inst_data.user_id
        // inst_obj.user_id = user_id

        if(institutionName){
            inst_obj.institutionName = institutionName
        }
        if(institutionCode){
            inst_obj.institutionCode = institutionCode
        }
        
        if(institution_logo ){
            let logo_local_path = req.files?.institution_logo[0]?.path

            if(!logo_local_path){
                return res.send({status: false, message: "Logo is required"})
            }
            const logo = await uploadOnCloudinary(logo_local_path)
            inst_obj.institution_logo = logo
            // if(inst_data.institution_logo != ""){

            //     let oldImagePath = `./logos/${inst_data.institution_logo}`
            //     if(fs.existsSync(oldImagePath)){
            //         try{
            //             fs.unlinkSync(oldImagePath)
            //             console.log('Image deleted: ', oldImagePath);
            //         } catch(err) {
            //             console.log('Error deleting logo: ', err);
            //         }
            //     }

            //     let file_name = institution_logo.file_name.split(".")[0]
            //     let ext = institution_logo.file_name.split(".")[1]
            //     const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
            //     let upload_name = `${file_name}_${randomNumber}.${ext}`
            //     if (!fs.existsSync("./logos"))
            //         fs.mkdirSync("./logos");
                            
            //     const outputFile = `./logos/${upload_name}`;
            
            //     if (institution_logo.baseString) {
            //         const base64Data = institution_logo.baseString.replace(/^data:.+;base64,/, "");
            
            //         fs.writeFileSync(outputFile, base64Data, "base64");
            //         console.log("File saved at:", outputFile);
                    
            //         inst_obj.institution_logo = upload_name

            //         // institution_logo = upload_name;
            //     } else {
            //             console.log("❌ ERROR: Base64 data missing!");
            //         }
            // } 
            // else{
            //     let file_name = institution_logo.file_name.split(".")[0]
            //     let ext = institution_logo.file_name.split(".")[1]
            //     const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
            //     let upload_name = `${file_name}_${randomNumber}.${ext}`
            //     if (!fs.existsSync("./logos"))
            //         fs.mkdirSync("./logos");
                            
            //     const outputFile = `./logos/${upload_name}`;
            
            //     if (institution_logo.baseString) {
            //         const base64Data = institution_logo.baseString.replace(/^data:.+;base64,/, "");
            
            //         fs.writeFileSync(outputFile, base64Data, "base64");
            //         console.log("File saved at:", outputFile);
                    
            //         inst_obj.institution_logo = upload_name

            //     } else {
            //             console.log("❌ ERROR: Base64 data missing!");
            //         }
            //     }        
        }            
        
        await db.collection("institution").updateOne({ user_id }, {$set: inst_obj })
        
        let user_data = await db.collection("users").findOne({ _id: new ObjectId(user_id) })
        if(!user_data){
            return res.send({ status: false, message: "User data not found" })
        } else{
            if(institutionName){
                user_obj.name = institutionName
            }
            if(email){
                user_obj.email = email
            }
            // if(password){
            //     user_obj.password = password
            // }
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

// for edit profile fetch details
exports.fetchInstitution = async(req, res)=>{
    console.log('fetchInstitution');
    let db = getDB()

    let user = req.user
    let user_id = user.id

    let user_data = await db.collection('users').findOne({_id: new ObjectId(user_id)})
    if(!user_data){
        return({status: false, message: "User not found"})
    } else{
        let inst_data = await db.collection('institution').findOne({user_id})
        
        if(!inst_data){
            user_data.inst_data = []
        } else{
            let logo = inst_data.institution_logo
            // let logo_url = logoUrl + logo
            inst_data.logoUrl = logo
            user_data.inst_data = inst_data

            return res.send({status: true, message: "Data fetched successfully", data: user_data})

        }

    }
}

exports.InstStats = async (req, res) => {
    console.log('InstStats');
    let db = getDB()

    try {
       
        let id = req.user.id 
        console.log('id from token', id);
        
        let data = await db.collection("users").findOne({ _id: new ObjectId(id) })
        // console.log('data', data);
        
        if(!data){
            return res.send({ status: false, message: "Data not found" })
        } else{
            let instData = await db.collection('institution').findOne({user_id: id});
            // console.log('instData', instData);
            let inst_id 
            if(instData){
                inst_id = instData._id.toString()
            }
            
            let total_students = await db.collection("students").count({ institution_id: inst_id })
            let expired_students = await db.collection("students").count({ institution_id: inst_id, status: "expired" })
            let certificates_issued = await db.collection("certificates").count({ institution_id: inst_id })
            let active_students = await db.collection("students").count({ institution_id: inst_id, status: "active" })
            
            
            let logo = data.institution_logo
            if(logo && logo != ""){
                data.institution_logo = logo
            }

            data.institution_data = instData
            data.total_students = total_students
            data.expired_students = expired_students
            data.certificates_issued = certificates_issued
            data.active_students = active_students

            return res.send({ status: true, message: "Data found sucessfully", data: data })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }   
    
}

exports.fetchInstitutionCertificates = async(req, res) => {
    console.log('fetchInstitutionCertificates', req.query);
    let db = getDB()
    
    try {
        let user_data = req.user;
        let user_id = user_data.id

        let {student_id, status, search} = req.query;
        let {page} = req.query || 1;
        let limit = 10;
        let skip = (Number(page)-1) * limit;
        // console.log('skip', skip);
        
        let query = {};

        if(student_id){
            query.student_id = student_id
        }
        if(status && status !== "all"){
            query.status = status
        }

        let inst_data = await db.collection('institution').findOne({user_id: user_id});
        if(inst_data){
            let inst_id = inst_data._id.toString();
            console.log('inst id', inst_id);
            query.institution_id = inst_id;
            
            let stud_ids;

            if(search){
                // console.log('queryyyyy',{name: {$regex: search, $options: 'i'}} );
                
                let students_data = await db.collection("students").find({name: {$regex: search, $options: 'i'}}).toArray();
                // console.log('students_data', students_data.length);
                
                if(students_data.length > 0){
                    stud_ids = students_data.map(stud => stud._id.toString())
                    // console.log('studids', stud_ids);
                    query.student_id = {$in: stud_ids}
                }
            }
            
            let total_records = await db.collection('certificates').count(query);
            console.log('total_records', total_records);
            console.log('query', query);
            
            let total_pages = Math.ceil(total_records/limit);
            let certificates = await db.collection('certificates').find(query).sort({_id: -1}).skip(skip).limit(limit).toArray();

            if(certificates.length == 0){
                return res.send({status: false, message: "No data available"})
            } else{

                certificates = await Promise.all(
                    certificates.map(async certificate => {
                        let pdf = certificate.pdf_url
                        // let pdf_url = pdfUrl + pdf 
                        certificate.pdf_url = pdf
                        
                        let student_id = certificate.student_id
                        let student_data = await db.collection("students").findOne({_id: new ObjectId(student_id)})
                        if(student_data){
                            // console.log('student_data', student_data);
                            
                            certificate.student_name = student_data.name
                            certificate.profile_picture = student_data.profile_picture
                        }

                        let course_id = certificate.course_id
                        let course_data = await db.collection("courses").findOne({_id: new ObjectId(course_id)});
                        if(course_data){
                            certificate.course_name = course_data.name
                        }
                        return certificate
                    })

                )
                return res.send({status: true, message: "Data fetched successfully", data: certificates, total_records, total_pages})
            }
        } else{
                return res.send({status: false, message: "Institution not found"})

        }

    } catch (error) {
        console.log('error', error);
        return res.send({status: false, message: 'Internal server error'})  
    }
}

exports.issueCertificate = async(req, res) => {
    console.log('issueCertificate', req.body);
    let db = getDB()
    
    try {
        let user_data = req.user //inst user
        let user_id = user_data.id;

        let inst_data = await db.collection("institution").findOne({user_id})
        let inst_id = inst_data._id.toString();

        let {student_id, course_id, issue_date, expiry_date} = req.body

        // let curr_date = new Date()
        // let issue_datee = curr_date.toISOString()
        // let end_date = new Date()
        // end_date.setDate(end_date.getDate() - 1)
        // end_date.setFullYear(end_date.getFullYear() + 1)
        // end_date = end_date.toISOString();

        let existing = await db.collection('certificates').find({institution_id: inst_id, student_id, course_id}).toArray();
        if(existing.length > 0){
            return res.send({status: false, message: "Certificate already issued"})
        }

        let certificate_inserted = await db.collection('certificates').insertOne({institution_id: inst_id, student_id, course_id, issue_date, expiry_date, status: "active",  qr_image: "", added_date: new Date() })

        let cert_id = certificate_inserted.insertedId.toString()

        // const qrData = JSON.stringify({
        //     // student_id: student_id,
        //     // course_id,
        //     // issue_date, 
        //     // expiry_date
        //     certificate_id: `http://localhost:5173/verify_certificate/${cert_id}`
        // });

        const qrData = `https://eduverify-verification.netlify.app/verify_certificate/${cert_id}`;

        if (!fs.existsSync(qrPath))
            fs.mkdirSync(qrPath);              

        const qrFileName = `qr_${cert_id}.png`;
        const qrFilePath = path.join(__dirname, qrPath, qrFileName);


        await QRCode.toFile(qrFilePath, qrData, {
            errorCorrectionLevel: 'H',
            width: 350,
            margin: 2
        });

        const qr_upload = await uploadOnCloudinary(qrFilePath)

        console.log("QR saved:");
        await db.collection('certificates').updateOne({_id: new ObjectId(cert_id)}, { $set: {qr_image: qrFileName, qr_url: qr_upload?.url } })


        // let data = {
        //     institution_id: inst_id,
        //     student_id,
        //     course_id,
        //     issue_date,
        //     expiry_date,
        // }

        return res.send({status: true, message: "Certificate issued successfully", id: cert_id.toString()})
        
    } catch (error) {
        console.log('error', error);
        return res.send({status: false, message: 'Internal server error'})       
    }
}

exports.revokeCertificate = async(req, res) => {
    console.log('revokeCertificate');
    
    let db = getDB()

    let certificate_id = req.body.certificate_id 
    let certificate_data = await db.collection("certificates").findOne({ _id: new ObjectId(certificate_id) })
    if(!certificate_data){
        return res.send({ status: false, message: "Certificate not found" })
    } else{
        await db.collection("certificates").updateOne({ _id: new ObjectId(certificate_id) }, { $set: {status: "revoked"} })

        return res.send({ status: true, message: "Certificate revoked successfully" })
    }
}