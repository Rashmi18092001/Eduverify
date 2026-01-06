let jwt = require('jsonwebtoken')
let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");


let JWT_SECRET = process.env.JWT_SECRET;
let profileUrl = process.env.PROFILE_URL;
let logoUrl = process.env.LOGO_URL;
let pdfUrl = process.env.PDF_URL;
let qrUrl = process.env.QR_URL;

const createToken = (user) => {
    return jwt.sign(  
      { id: user.id, email: user.email },
      JWT_SECRET,
    { expiresIn: '1d' }  
    );  
};

exports.addAdmin = async(req, res) =>{
    console.log('addAdmin', req.body);
    let db = getDB()

    try {
        let { email, password } = req.body
        let admin_data = await db.collection("admin").find({ email }).toArray()
        
        if(admin_data.length == 0){
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            await db.collection("admin").insertOne({email, password: hashedPassword})

            return res.send({ status: true, message: "Admin added successfully" })

        } else{
            return res.send({ status: false, message: "Email already exists" })
            
        }
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }  
}

exports.loginAdmin = async (req, res) => {
    console.log('loginAdmin', req.body);
    let db = getDB()

    try {
        let {email, password} = req.body
        let admin_data = await db.collection("admin").find({email}).toArray()

        if(admin_data.length == 0){
            return res.send({ status: false, message: "Email not found" }) 
        } else{
            let admin_hashed_pass = admin_data[0].password

            const isMatch = await bcrypt.compare(password, admin_hashed_pass);
            if(!isMatch){
                return res.send({ status: false, message: "Incorrect password", token })
            } else{
                let id = admin_data[0]._id.toString()
                let email = admin_data[0].email
                let token = createToken({id, email})

                return res.send({ status: true, message: "Admin logged in sucessfully", token })
            }
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }  

}

exports.editAdmin = async (req, res) => {
    console.log('editAdmin', req.body);
    let db = getDB()

    try {
        let { admin_id, email, password} = req.body

        let admin_data = await db.collection("admin").findOne({_id: new ObjectId(admin_id)})
        if(!admin_data){
            return res.send({ status: false, message: "Admin not found" })
        } else{
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            await db.collection("admin").updateOne({_id: new ObjectId(admin_id)}, {$set: {email, password: hashedPassword}})
            return res.send({ status: true, message: "Admin edited sucessfully" })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }  
}

exports.fetchSingleInstitution = async (req, res) => {
    console.log('fetchSingleInstitution', req.query);
    let db = getDB()

    try {
        let id = req.query.id 

        let inst_data = await db.collection("institution").findOne({ _id: new ObjectId(id) })
        if(!inst_data){
            return res.send({ status: false, message: "nstitution not found" })
        } else{
            let inst_logo = inst_data.institution_logo
            if(inst_logo != ""){
                let logo_url = logoUrl + inst_logo
                inst_data.logo_url = logo_url
            }
            let student_data = await db.collection("students").find({institution_id: id}).toArray()
            if(student_data.length == 0){
                inst_data.student_data = []
            } else{
                for(let i = 0; i < student_data.length; i++){
                    let student = student_data[i]
                    let student_id = student._id.toString()
                    let profile = student.profile_picture
                    if(profile != ""){
                       let profile_url = profileUrl + student.profile_picture
                       student_data[i].profile_url = profile_url
                    }
                    let stud_cert_data = await db.collection("certificates").find({ student_id: student_id }).toArray()
                    if(stud_cert_data.length == 0){
                        student_data[i].certifcates = []
                    }
                    for(let j = 0; j<stud_cert_data.length; j++){
                        let pdf_name = stud_cert_data[j].pdf
                        if(pdf_name != ""){
                            let pdf_url = pdfUrl + pdf_name
                            stud_cert_data[j].pdf_url = pdf_url
                        }
                    }
                    student_data[i].certifcates = stud_cert_data

                }
                inst_data.student_data = student_data

            }

            return res.send({ status: true, message: "Institution fetched sucessfully", data: inst_data })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }     
}

exports.fetchAllInstitutions = async (req, res) => {
    console.log('fetchAllInstitutions', req.query);
    let db = getDB()

    try {
        let page = req.query.page
        if(page == undefined || page == null){
            page = 1
        } else{
            page = parseInt(page)
        }
        let limit = 20
        let skip = (page-1) * limit

        let total_count = await db.collection("institution").count({})
        let total_pages = Math.ceil(total_count/limit)
        let inst_data = await db.collection("institution").find({}).sort({_id: -1}).skip(skip).limit(limit).toArray()
        if(inst_data.length == 0){
            return res.send({ status: false, message: "No institutions available" })
        } else{
            for(let i = 0; i< inst_data.length; i++){
                let logo = inst_data[i].institution_logo
                if(logo){
                    let logo_url = logoUrl + logo
                    if(logo_url && logo_url != ""){
                        inst_data[i].logo_url = logo_url
                    }
                }
            }
            return res.send({ status: true, message: "Data found successfully", data: inst_data, total_count, total_pages })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }  
}

exports.fetchStudentByInstitution = async (req, res) => {
    console.log('fetchStudentByInstitution', req.query);
    let db = getDB()

    try {
        let { institution_id } = req.query

        let inst_data = await db.collection("institution").findOne({_id: new ObjectId(institution_id)})
        if(!inst_data){
            return res.send({ status: false, message: "Institution not found" })
        } else{
            let institution_logo = inst_data.institution_logo
            if(!institution_logo){
                institution_logo = ""
            } else{
                institution_logo = logoUrl + institution_logo
                inst_data.institution_logo = institution_logo
            }
            let student_data = await db.collection("students").find({ institution_id }).toArray()
            if(student_data.length == 0){
            inst_data.students = []
            }
            for(let i=0; i< student_data.length; i++){
                let student_profile = student_data[i].profile_picture
                if(student_profile && student_profile != ""){
                    let profile_url = profileUrl + student_profile
                    student_data[i].profile_url = profile_url
                }
            }
            inst_data.students = student_data

            return res.send({ status: true, message: "Data fetched successfully", data: inst_data })
        }

    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }
    
}

exports.deleteInstitution = async (req, res) => {
    let db = getDB();    
    
    try {
        const { inst_id } = req.body;

        if (!ObjectId.isValid(inst_id)) {
            return res.send({
                status: false,
                message: "Invalid institution ID"
            });
        }

        const instObjectId = new ObjectId(inst_id);
        console.log('instObjectId', instObjectId);
        
        const institution = await db.collection("institution").findOne({
            _id: instObjectId
        });
        console.log('institution', institution);
        
        if (!institution) {
            return res.send({
                status: false,
                message: "Institution not found"
            });
        }

        const institutionUserId = institution.user_id; 

        const students = await db.collection("students")
            .find({ institution_id: inst_id })
            .project({ user_id: 1 })
            .toArray();

        const studentUserObjectIds = students
            .map(s => s.user_id)
            .filter(id => ObjectId.isValid(id))
            .map(id => new ObjectId(id));

        await db.collection("institution").deleteOne({
            _id: instObjectId
        });

        await db.collection("users").deleteOne({
            _id: new ObjectId(institutionUserId)
        });

        await db.collection("students").deleteMany({
            institution_id: inst_id
        });

        if (studentUserObjectIds.length > 0) {
            await db.collection("users").deleteMany({
                _id: { $in: studentUserObjectIds }
            });
        }

        return res.send({
            status: true,
            message: "Institution, students, and all related users deleted successfully"
        });

    } catch (err) {
        console.error("Delete institution error:", err);
        return res.send({
            status: false,
            message: "Internal server error"
        });
    }
};
