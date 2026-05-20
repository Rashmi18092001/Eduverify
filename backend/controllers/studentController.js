let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");

let fs = require('fs')
const bcrypt = require("bcrypt");
const {uploadOnCloudinary} = require('../utils/cloudinary')
 

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

        let inst = req.user

        let institution_id;
        if(inst){
            
            let user_id = inst.id
            
            let inst_data = await db.collection("institution").findOne({user_id: user_id});

            if(inst_data){
                institution_id = inst_data?._id.toString()            
            }
        }
        
        // let { name, phone, course_id, branch, yearOfStudy, email, password, profile_picture } = req.body 
        let { name, phone, batch, email, address, password } = req.body 

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        

        // if(profile_picture){
        //     let file_name = profile_picture.file_name.split(".")[0]
        //     let ext = profile_picture.file_name.split(".")[1]
        //     const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
        //     let upload_name = `${file_name}_${randomNumber}.${ext}`
        //     if (!fs.existsSync(profilePath))
        //         fs.mkdirSync(profilePath);
                        
        //         const outputFile = `${profilePath}/${upload_name}`;
        
        //         if (profile_picture.baseString) {
        //             const base64Data = profile_picture.baseString.replace(/^data:.+;base64,/, "");
        
        //             fs.writeFileSync(outputFile, base64Data, "base64");
        //             console.log("File saved at:", outputFile);
        
        //             profile_picture = upload_name;
        //         } else {
        //             console.log("❌ ERROR: Base64 data missing!");
        //         }
        // }

        let insertedUser = await db.collection('users').insertOne({name, email, phone, password: hashedPassword, role: "student", status: 'active', createdAt: new Date()})

        // let insertedStudent = await db.collection('students').insertOne({ user_id: insertedUser.insertedId.toString(), institution_id, name, phone_no: phone, course_id, branch, yearOfStudy, status: 'active', profile_picture, added_date: new Date() })

        let insertedStudent = await db.collection('students').insertOne({ user_id: insertedUser.insertedId.toString(), institution_id, name, phone_no: phone, batch, address, status: 'active', added_date: new Date() })
        
        let studentId = insertedStudent.insertedId.toString()
        
        // let certificate_inserted = await db.collection('certificates').insertOne({student_id: insertedStudent.insertedId.toString(), course_id, issue_date: issue_datee, expiry_date: end_date, status: "active",  qr_image: "", added_date: new Date() })
        // let cert_id = certificate_inserted.insertedId.toString()

        // const qrData = JSON.stringify({
        //     student_id: studentId,
        //     course_id,
        //     issue_date: issue_datee,
        //     expiry_date: end_date
        // });

        // console.log('qrPath', qrPath);
        
        // if (!fs.existsSync(qrPath))
        //     fs.mkdirSync(qrPath);
              

        // const qrFileName = `qr_${cert_id}.png`;
        // const qrFilePath = path.join(__dirname, qrPath, qrFileName);

        // await QRCode.toFile(qrFilePath, qrData, {
        //     errorCorrectionLevel: 'H',
        //     width: 350,
        //     margin: 2
        // });

        // console.log("QR saved:", qrFilePath);

        // await db.collection('certificates').updateOne({_id: new ObjectId(cert_id)}, { $set: {qr_image: qrFileName } })
        
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
            // console.log('stud_details', stud_details);
            
            let user_id = stud_details.user_id
            console.log('user_id', user_id);
            
            let user_data = await db.collection("users").findOne({_id: new ObjectId(user_id)});
            // console.log('user_data', user_data);
            
            if(user_data){
                stud_details.user_details = user_data
            }

            let course_id = stud_details.course_id
            console.log('course_id', course_id);
            
            if(course_id){
                const course_details = await db.collection("courses").findOne({_id: new ObjectId(course_id)});
                console.log('course_details', course_details);
                
                if(course_details){
                    stud_details.course_details = course_details
                }
            }

            let student_profile = stud_details.profile_picture
            stud_details.profile_url = student_profile
            let stud_cert = await db.collection("certificates").find({student_id: stud_id}).toArray()
            if(stud_cert.length == 0){
                stud_details.certificates = []
            } else{
                for(let i=0; i<stud_cert.length; i++){
                    let certificate = stud_cert[i]
                    let pdf = certificate.pdf_url
                    if(pdf && pdf != ""){
                        // let pdf_url = pdfUrl + pdf 
                        certificate.pdf_url = pdf
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

exports.fetchStudent = async (req, res) => {
    console.log('fetchStudent', req.query);
    let db = getDB()

    try {
        let stud_data = req.user 
        let user_id = stud_data?.id;
        console.log('user id', user_id);
        
        
        let stud_details = await db.collection("students").findOne({user_id: user_id })
        if(!stud_details){
            return res.send({ status: false, message:"Student data not found" })
        } else{    
        
            let user_data = await db.collection('users').findOne({_id: new ObjectId(user_id)})   
            if(user_data){
                stud_details.user_details = user_data
            }
            let student_id = stud_details._id.toString()
            console.log('stud id', student_id);
            
            let student_profile = stud_details.profile_picture
            stud_details.profile_url = student_profile
            let stud_cert = await db.collection("certificates").find({student_id: student_id}).toArray()
            if(stud_cert.length == 0){
                stud_details.certificates = []
            } else{
                for(let i=0; i<stud_cert.length; i++){
                    let certificate = stud_cert[i]
                    let course_id = certificate.course_id

                    let course_data = await db.collection("courses").findOne({_id: new ObjectId(course_id)})
                    if(course_data){
                        certificate.course_name = course_data.name
                    } 

                    let pdf = certificate.pdf_url
                    if(pdf && pdf != ""){
                        // let pdf_url = pdfUrl + pdf 
                        certificate.pdf_url = pdf
                    }
                }
                stud_details.certificates = stud_cert
            }

            // let certificates = stud_details.certificates
            // for (let i = 0; i < certificates.length; i++) {
            //     const certificate = certificates[i];
               
            //     let pdf = certificate.pdf
            //     if(pdf && pdf != ""){
            //         let pdf_url = pdfUrl + pdf 
            //         certificate.pdf_url = pdf_url
            //     }

            //     let course_data = await db.collection("courses").findOne({_id: new ObjectId(course_id)})
            //     if(course_data){
            //         certificate.course_name = course_data.name
            //     } 
            // }

            let total_certs = await db.collection('certificates').count({student_id: student_id})
            stud_details.total_certificates = total_certs;
            
            let active_certs = await db.collection('certificates').count({student_id: student_id, status: 'active'})
            stud_details.active_certificates = active_certs;
            
            let expire_certs = await db.collection('certificates').count({student_id: student_id, status: 'expired'})
            stud_details.expired_certificates = expire_certs;

            return res.send({ status: true, message: "Student fetched succesfully", data: stud_details })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
    
}


exports.editStudent = async (req, res) => {
    console.log('editStudent', req.body);
    let db = getDB()

    try {
        let user_data = req.user
        let user_id = user_data.id
        console.log('user_id', user_id);
        
        let {email, phone, name} = req.body 
        let {profile_picture} = req.files

        let studObj = {}
        let userObj = {}
        let certificateObj = {}

        let student_data = await db.collection('students').findOne({ user_id: user_id })
        if(!student_data){
            return res.send({ status: false, message: "Student data not found" })
        } else{
            let student_id = student_data._id.toString()
            let user_data = await db.collection('users').findOne({ _id: new ObjectId(user_id) })

            if(!user_data){
                return res.send({ status: false, message: "User not found" })
            } else{
                let user_profile = user_data.profile_picture
                
                if(email){
                    userObj.email = email
                }
                // if(password){
                //     userObj.password = password
                // }
                if(phone){
                    userObj.phone = phone
                    studObj.phone_no = phone
                }
                if(name){
                    studObj.name = name
                    userObj.name = name
                }
                // if(course_id){
                //     studObj.course_id = course_id
                //     certificateObj.course_id = course_id
                // }
                // if(branch){
                //     studObj.branch = branch
                // }
                // if(typeof profile_picture === "object"){
                //     if(user_profile != ""){
                //         let file_name = profile_picture.file_name.split(".")[0]
                //         let ext = profile_picture.file_name.split(".")[1]
                //         const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
                //         let upload_name = `${file_name}_${randomNumber}.${ext}`
                //         if (!fs.existsSync("./profile"))
                //             fs.mkdirSync("./profile");
                                
                //         const outputFile = `./profile/${upload_name}`;
                
                //         if (profile_picture.baseString) {
                //             const base64Data = profile_picture.baseString.replace(/^data:.+;base64,/, "");
                
                //             fs.writeFileSync(outputFile, base64Data, "base64");
                //             console.log("File saved at:", outputFile);
                
                //             studObj.profile_picture = upload_name;
                //         } else {
                //             console.log("ERROR: Base64 data missing!");
                //         }
                //     }                    
                // }
                
                if(profile_picture){
                    let profile_local_path = req.files?.profile_picture[0]?.path

                    if(!profile_local_path){
                        return res.send({status: false, message: "Profile picture is required"})
                    }

                    const profile = await uploadOnCloudinary(profile_local_path)
                    console.log('profile', profile);
                    studObj.profile_picture = profile?.url
                }
                
                console.log('studObj', studObj);
                // console.log('certificateObj', certificateObj);
                console.log('userObj', userObj);
                
                // await db.collection('certificates').updateOne({ student_id: id }, { $set: certificateObj })
                await db.collection('students').updateOne({ _id: new ObjectId(student_id) }, { $set: studObj })
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
    let inst = req.user

    let inst_id;
    if(inst){
        
        let user_id = inst.id
        
        let inst_data = await db.collection("institution").findOne({user_id: user_id});

        if(inst_data){
            inst_id = inst_data?._id            
        }
    }

    try{
        let { search, status, page } = req.query
        if(page == undefined || page == null){
            page = 1
        }else{
            page = parseInt(page)
        }
        let limit = 10
        let skip = (page -1) * limit

        let query = {}
        if(search){
            query.$or = [
                {name: {$regex: search, $options: 'i'}},
                // {email: {$regex: search}}
            ]
        }
        
        if(status){
            query.status = status
        }
        if(inst_id){
            query.institution_id = inst_id.toString()
        }
        console.log('query', query);
        
        let total_count = await db.collection("students").count(query)
        let total_pages = Math.ceil(total_count/limit)
        let student_data = await db.collection("students").find(query).sort({ _id: -1 }).skip(skip).limit(limit).toArray();
        
        if(student_data.length == 0){
            return res.send({ status: false, message: "No data found" })
        } else{
            for(let i=0; i< student_data.length; i++){
                let student = student_data[i]
                let user_id = student.user_id.toString()
                let course_id = student.course_id

                if(course_id){
                    let course_data = await db.collection('courses').findOne({_id: new ObjectId(course_id)});

                    if(course_data){
                        student.course_details = course_data;
                    }
                }

                if(user_id){
                    let user_data = await db.collection('users').findOne({_id: new ObjectId(user_id)});
                    if(user_data){
                        student.user_details = user_data
                    }
                }
                
                let stud_data = await db.collection("students").findOne({ user_id })
                
                if(stud_data){                    
                    let profile = stud_data.profile_picture
                    // console.log('profile', profile);
                    
                    if(profile && profile != ""){
                        student.profile_url = profile
                    }
                }
                if(inst_id){
                    let inst_data = await db.collection("institution").findOne({ _id: new ObjectId(inst_id) })
                    if(!inst_data){
                        student.institution_data = []
                    } else{
                        if(inst_data.institution_logo){
                            let logo_url = inst_data.institution_logo
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
                    let pdf = certificate.pdf_url
                    if(pdf && pdf != ""){
                        let pdf_url = pdf
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

exports.fetchOwnCertificates = async (req, res) =>{
    console.log('fetchOwnCertificates', req.query);
    let db = getDB()

    try {
        let user_data = req.user
        let user_id = user_data.id
        console.log('user_id', user_id);
        
        let {page} = req.query || 1;
        let limit = 10;
        let skip = (Number(page) - 1) * limit;
        let student_id;
        
        let student_data = await db.collection("students").findOne({user_id: user_id})
        if(!student_data){
            return res.send({ status: false, message: "Student not found" })
        } else{
            student_id = student_data._id.toString();
            console.log('student_id', student_id);

            const totalPages = await db.collection("certificates").count({student_id})
            const totalRecords = Math.ceil(totalPages/limit);

            let certificate_data = await db.collection("certificates").find({student_id}).sort({_id: -1}).limit(limit).skip(skip).toArray()
            if(certificate_data.length == 0){
                return res.send({ status: false, message: "No certificates available" })
            } else{
                for(let i=0; i<certificate_data.length; i++ ){
                    let certificate = certificate_data[i]
                    let issue_date = certificate.issue_date
                    certificate.issue_date = issue_date.split('T')[0]
                    let expiry_date = certificate.expiry_date
                    certificate.expiry_date = expiry_date.split('T')[0]

                    let course_id = certificate.course_id
                    let course_name = ""
                    let course_data = await db.collection("courses").findOne({ _id: new ObjectId(course_id) })
                    if(course_data){
                        course_name = course_data.name
                    }
                    certificate.course_name = course_name
                    let pdf = certificate.pdf_url
                    if(pdf && pdf != ""){
                        let pdf_url = pdf
                        certificate.pdf_url = pdf_url
                    }
                }
                student_data.certificate_data = certificate_data
            }
            return res.send({ status: true, message: "Data fetched sucessfully", data: student_data, totalPages, totalRecords })
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

exports.changePassword = async(req, res) => {
    console.log('changePassword', req. body);
    let db = getDB()
    
    let {current_pass, new_pass} = req.body

    let user = req.user
    let user_id = user.id

    let user_data = await db.collection("users").findOne({_id: new ObjectId(user_id)});
    if(!user_data){
        return res.send({status: false, message: "User not found"});
    }
    let hashedPassword = user_data.password;
    let cmp = await bcrypt.compare(current_pass, hashedPassword);
    console.log(cmp);
    
    if(!cmp){
        return res.send({status: false, message: "Current password does not match"})
    } 

    const saltRounds = 10;
    let newHashPass = await bcrypt.hash(new_pass, saltRounds)

    let updated = await db.collection("users").updateOne({_id: new ObjectId(user_id)}, {$set: {password: newHashPass}})
    if(updated){
        return res.send({status: true, message: "Password updated successfully"})
    } else{
        return res.send({status: false, message: "Password not updated"})
    }
}