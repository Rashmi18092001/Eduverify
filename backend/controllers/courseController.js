let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let fs = require('fs')
let path = require('path')

exports.addCourse = async (req, res) => {
    console.log('addCourse', req.body);
    let db = getDB()

    try {
        let user_data = req.user
        let user_id = user_data.id

        let inst_data = await db.collection("institution").findOne({user_id: user_id})
        if(inst_data){
            let inst_id = inst_data._id.toString()
            let {name, price, duration } = req.body 
            await db.collection("courses").insertOne({ institution_id: inst_id, name, price, duration })
            return res.send({ status: true, message: "Course added successfully" })
        }
        
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }   
}

exports.fetchAllCourse = async (req, res) => {
    console.log('fetchAllCourse', req.query);

    let db = getDB()
    try {
        let inst = req.user
        let {name, page} = req.query
        let skip = (Number(page) * 1) || 0;
        let limit = 10;

        let institution_id;
        if(inst){
            
            let user_id = inst.id
            
            let inst_data = await db.collection("institution").findOne({user_id: user_id});

            if(inst_data){
                institution_id = inst_data?._id.toString()            
            }
        }

        let query = {institution_id}
        if(name){
            query.name = {$regex: name, $options: 'i'}
        }

        let total_records = await db.collection("courses").count(query)

        let total_pages = Math.ceil(total_records/limit)
        
        let course_data = await db.collection("courses").find(query).sort({_id: 1}).skip(skip).limit(limit).toArray()

        if(course_data.length == 0){
            return res.send({ status: false, message: "No courses found" })
        } else{
            return res.send({ status: true, message: "Courses found successfully", data: course_data, total_records, total_pages })
        }        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }  
}

exports.fetchSingleCourse = async (req, res) => {
    console.log('fetchSingleCourse', req.query);

    let db = getDB()
    try {
        let {course_id} = req.query
        let course_data = await db.collection("courses").findOne({ _id: new ObjectId(course_id) })
        if(!course_data){
            return res.send({ status: false, message: "Course not found" })
        } else{
            return res.send({ status: true, message: "Course found successfully", data: course_data })
        }        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }  
}

exports.editCourse = async (req, res) => {
    console.log('editCourse', req.body);
    let db = getDB()

    try {
        let {course_id} = req.query
        let { name, price, duration} = req.body
        let course_data = await db.collection("courses").findOne({ _id: new ObjectId(course_id) })
        if(!course_data){
            return res.send({ status: false, message: "Course not found" })
        } else{
            let updatedObj = {}
            if(name) updatedObj.name = name
            if(price) updatedObj.price = price
            if(duration) updatedObj.duration = duration

            await db.collection("courses").updateOne({ _id: new ObjectId(course_id) }, { $set: {...updatedObj} })
            return res.send({ status: true, message: "Course edited sucessfully" })
        }
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }     
}

exports.deleteCourse = async (req, res) => {
    console.log('deleteCourse', req.body);
    let db = getDB()

    try {
        let course_id = req.body.course_id
        await db.collection("courses").deleteOne({ _id: new ObjectId(course_id) })
        return res.send({ status: true, message: "Course delete successfully" })
        
    } catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }   
    
}