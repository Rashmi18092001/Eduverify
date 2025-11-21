// let JWT_SECRET = '28253c4fdc5c7e6faf4ab149f14161e4a38b5230be4ca4e6fd16ce112644aa2458dcc78522c23cfd6ded5157eabf4a81c0e77ecf3c18620a999fff7a4b4c9d37'
// let jwt = require('jsonwebtoken')
let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let path = require('path')
const QRCode = require('qrcode')
let fs = require('fs')


let profileUrl = process.env.PROFILE_URL;
let logoUrl = process.env.LOGO_URL;
let pdfUrl = process.env.PDF_URL;
let qrUrl = process.env.QR_URL;
let profilePath = process.env.PROFILE_PATH;
let logoPath = process.env.LOGO_PATH;
let pdfPath = process.env.PDF_PATH;
let qrPath = process.env.QR_PATH;

exports.addStudent = async (req, res) => {
    console.log('addStudent', req.body);
    try {
        let db = getDB()

        let { institution_id, name, phone, course_id, branch, yearOfStudy, email, password, profile_picture } = req.body 

        let curr_date = new Date()
        let issue_datee = curr_date.toISOString()
        let end_date = new Date()
        end_date.setDate(end_date.getDate() - 1)
        end_date.setFullYear(end_date.getFullYear() + 1)
        end_date = end_date.toISOString();

        if(profile_picture){
            let file_name = profile_picture.file_name.split(".")[0]
            let ext = profile_picture.file_name.split(".")[1]
            const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
            let upload_name = `${file_name}_${randomNumber}.${ext}`
            if (!fs.existsSync(profilePath))
                fs.mkdirSync(profilePath);
                        
                const outputFile = `${profilePath}/${upload_name}`;
        
                if (profile_picture.baseString) {
                    const base64Data = profile_picture.baseString.replace(/^data:.+;base64,/, "");
        
                    fs.writeFileSync(outputFile, base64Data, "base64");
                    console.log("File saved at:", outputFile);
        
                    profile_picture = upload_name;
                } else {
                    console.log("❌ ERROR: Base64 data missing!");
                }
        }

        let insertedUser = await db.collection('users').insertOne({name, email, phone, password, role: "student", status: 'active', createdAt: new Date()})
        let insertedStudent = await db.collection('students').insertOne({ user_id: insertedUser.insertedId.toString(), institution_id, name, phone_no: phone, course_id, branch, yearOfStudy, status: 'active', profile_picture, added_date: new Date() })
        let studentId = insertedStudent.insertedId.toString()
        
        let certificate_inserted = await db.collection('certificates').insertOne({student_id: insertedStudent.insertedId.toString(), course_id, issue_date: issue_datee, expiry_date: end_date, status: "active",  qr_image: "", added_date: new Date() })
        let cert_id = certificate_inserted.insertedId.toString()

        const qrData = JSON.stringify({
            student_id: studentId,
            course_id,
            issue_date: issue_datee,
            expiry_date: end_date
        });

        console.log('qrPath', qrPath);
        
        if (!fs.existsSync(qrPath))
            fs.mkdirSync(qrPath);
              

        const qrFileName = `qr_${cert_id}.png`;
        // const qrPath = path.join(__dirname, '../qr', qrFileName);
        const qrFilePath = path.join(__dirname, qrPath, qrFileName);


        // Generate & save QR PNG file
        await QRCode.toFile(qrFilePath, qrData, {
            errorCorrectionLevel: 'H',
            width: 350,
            margin: 2
        });

        console.log("QR saved:", qrFilePath);

        await db.collection('certificates').updateOne({_id: new ObjectId(cert_id)}, { $set: {qr_image: qrFileName } })
        
        return res.send({ status: true, message: "Student added sucessfully" })
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
}

exports.fetchSingleStudent = async (req, res) => {
    console.log('fetchSingleStudent', req.query);
    let db = getDB()

    try {
        let { stud_id } = req.query 
        let stud_details = await db.collection("students").findOne({_id: new ObjectId(stud_id) })
        if(!stud_details){
            return res.send({ status: false, message:"Student data not found" })
        } else{
            let student_profile = stud_details.profile_picture
            stud_details.profile_url = profileUrl + student_profile
            let stud_cert = await db.collection("certificates").find({student_id: stud_id}).toArray()
            if(stud_cert.length == 0){
                stud_details.certificates = []
            } else{
                for(let i=0; i<stud_cert.length; i++){
                    let certificate = stud_cert[i]
                    let pdf = certificate.pdf
                    if(pdf && pdf != ""){
                        let pdf_url = pdfUrl + pdf 
                        certificate.pdf_url = pdf_url
                    }
                    let course_id = certificate.course_id
                    let course_data = await db.collection("courses").findOne({_id: new ObjectId(course_id)})
                    let course_details = {}
                    if(course_data){
                        course_details = course_data
                    }
                }
                stud_details.certificates = stud_cert
            }

            return res.send({ status: true, message: "Student fetched succesfully", data: stud_details })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
    
}

//edit image - add new key
exports.editStudent = async (req, res) => {
    console.log('editStudent', req.body);
    let db = getDB()

    try {
        let {id, email, phone, password, name, course_id, branch, profile_picture} = req.body 

        let studObj = {}
        let userObj = {}
        let certificateObj = {}

        let student_data = await db.collection('students').findOne({ _id: new ObjectId(id) })
        if(!student_data){
            return res.send({ status: false, message: "Student data not found" })
        } else{

            let user_id = student_data.user_id
            let user_data = await db.collection('users').findOne({ _id: new ObjectId(user_id) })

            if(!user_data){
                return res.send({ status: false, message: "User not found" })
            } else{
                let user_profile = user_data.profile_picture
                
                if(email){
                    userObj.email = email
                }
                if(password){
                    userObj.password = password
                }
                if(phone){
                    userObj.phone = phone
                    studObj.phone_no = phone
                }
                if(name){
                    studObj.name = name
                }
                if(course_id){
                    studObj.course_id = course_id
                    certificateObj.course_id = course_id
                }
                if(branch){
                    studObj.branch = branch
                }
                if(typeof profile_picture === "object"){
                    if(user_profile != ""){
                        let file_name = profile_picture.file_name.split(".")[0]
                        let ext = profile_picture.file_name.split(".")[1]
                        const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
                        let upload_name = `${file_name}_${randomNumber}.${ext}`
                        if (!fs.existsSync("./profile"))
                            fs.mkdirSync("./profile");
                                
                        const outputFile = `./profile/${upload_name}`;
                
                        if (profile_picture.baseString) {
                            const base64Data = profile_picture.baseString.replace(/^data:.+;base64,/, "");
                
                            fs.writeFileSync(outputFile, base64Data, "base64");
                            console.log("File saved at:", outputFile);
                
                            studObj.profile_picture = upload_name;
                        } else {
                            console.log("ERROR: Base64 data missing!");
                        }
                    }                    
                }
                console.log('studObj', studObj);
                console.log('certificateObj', certificateObj);
                console.log('userObj', userObj);
                
                await db.collection('certificates').updateOne({ student_id: id }, { $set: certificateObj })
                await db.collection('students').updateOne({ _id: new ObjectId(id) }, { $set: studObj })
                await db.collection('users').updateOne({ _id: new ObjectId(user_id) }, { $set: userObj })

                return res.send({ status: true, message: "Student details updated successfully" })
            }

           
        }
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
   
    
}

exports.deleteStudent = async (req, res) => {
    console.log('deleteStudent', req.body);
    let db = getDB()

    try {
        let student_id = req.body.student_id

        let student_data = await db.collection("students").findOne({ _id: new ObjectId(student_id) })
        if(!student_data){
            return res.send({ status: false, message: "Student not found" })
        } else{
            let user_id = student_data.user_id
            await db.collection("students").updateOne({ _id: new ObjectId(student_id) }, {$set: {is_delete: true}})

            let user_data = await db.collection("users").findOne({ _id: new ObjectId(user_id) })
            if(!user_data){
                return res.send({ status: false, message: "User not found" })
            }
            await db.collection("users").updateOne({ _id: new ObjectId(user_id) }, {$set: {is_delete: true}})
            return res.send({ status: true, message: "Student deleted successfully" })
        }        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
    
}

exports.fetchStudentBySearch = async (req, res) => {
    console.log('fetchStudentBySearch', req.query);
    let db = getDB()

    try{
        let { institution_id, search, status, page } = req.query
        if(page == undefined || page == null){
            page = 1
        }else{
            page = parseInt(page)
        }
        let limit = 20
        let skip = (page -1) * limit

        let query = {}
        if(search){
            query.$or = [
                {name: {$regex: search}},
                {email: {$regex: search}}
            ]
        }
        
        if(status){
            query.status = status
        }
        if(institution_id){
            query.institution_id = institution_id
        }
        console.log('query', query);
        
        let total_count = await db.collection("users").count(query)
        let total_pages = Math.ceil(total_count/limit)
        let student_data = await db.collection("users").find(query).sort({ _id: -1 }).skip(skip).limit(limit).toArray()
        if(student_data.length == 0){
            return res.send({ status: false, message: "No data found" })
        } else{
            for(let i=0; i< student_data.length; i++){
                let student = student_data[i]
                let user_id = student._id.toString()

                let stud_data = await db.collection("students").findOne({ user_id })
                if(stud_data){
                    let profile = stud_data.profile_picture
                    if(profile && profile != ""){
                        student.profile_url = profileUrl + profile
                    }
                }
                if(institution_id){
                    let inst_data = await db.collection("institution").findOne({ _id: new ObjectId(institution_id) })
                    if(!inst_data){
                        student.institution_data = []
                    } else{
                        if(inst_data.institution_logo){
                            let logo_url = logoUrl + inst_data.institution_logo
                            inst_data.logo_url = logo_url
                        }
                        student.institution_data = inst_data
                    }
                }
            }
            return res.send({ status: true, message: "Data fetched successfully", data: student_data, total_count, total_pages })
        }

    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
    
}

exports.fetchCertificates = async (req, res) =>{
    console.log('fetchCertificates', req.query);
    let db = getDB()

    try {
        let {student_id } = req.query
        let student_data = await db.collection("students").findOne({_id: new ObjectId(student_id)})
        if(!student_data){
            return res.send({ status: false, message: "Student not found" })
        } else{
            let certificate_data = await db.collection("certificates").find({student_id}).sort({_id: -1}).toArray()
            if(certificate_data.length == 0){
                return res.send({ status: false, message: "No certificates available" })
            } else{
                for(let i=0; i<certificate_data.length; i++ ){
                    let certificate = certificate_data[i]
                    let course_id = certificate.course_id
                    let course_name = ""
                    let course_data = await db.collection("courses").findOne({ _id: new ObjectId(course_id) })
                    if(course_data){
                        course_name = course_data.name
                    }
                    certificate.course_name = course_name
                    let pdf = certificate.pdf
                    if(pdf && pdf != ""){
                        let pdf_url = pdfUrl + pdf
                        certificate.pdf_url = pdf_url
                    }
                }
                student_data.certificate_data = certificate_data
            }
            return res.send({ status: true, message: "Data fetched sucessfully", data: student_data })
        }

    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
}

exports.revokeStudent = async (req, res) => {
    console.log('revokeStudent', req.body);
    let db = getDB()

    let student_id = req.body.student_id 
    let student_data = await db.collection("students").findOne({ _id: new ObjectId(student_id) })
    if(!student_data){
        return res.send({ status: false, message: "Student not found" })
    } else{
        let user_id = student_data.user_id
        await db.collection("users").updateOne({ _id: new ObjectId(user_id) }, { $set: {status: "revoked"} })
        await db.collection("students").updateOne({ _id: new ObjectId(student_id) }, { $set: {status: "revoked"} })
        return res.send({ status: true, message: "Student revoked successfully" })
    }
} 