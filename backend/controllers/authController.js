let jwt = require('jsonwebtoken')
let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let fs = require('fs')
let path = require('path')
const bcrypt = require("bcrypt");
const {uploadOnCloudinary} = require('../utils/cloudinary')

let ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;
let REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET;

const createAccessToken = (user) => {
  console.log('user', user);
  
    return jwt.sign(  
      { id: user.id, email: user.email, role: user.role },
      ACCESSTOKEN_SECRET,
      { expiresIn: '1d' }  
    );  
};

const createRefreshToken = (user) => {
  console.log('user', user);
  
    return jwt.sign(  
      { id: user.id },
      REFRESHTOKEN_SECRET,  
      { expiresIn: '7d' }  
    );  
};
 
  
exports.register = async (req, res) => {
    console.log('register', req.body);    
    console.log('register', req.files);    

    let db = getDB()

    try{
        let { email, password, role, phone, institutionName, institutionCode, institution_logo } = req.body

        let user = await db.collection('users').findOne({ email })
        if(user){
            return res.send({ status: false, message: "Email already exists" })
        }else{
            let curr_date = new Date()
            let issue_datee = curr_date.toISOString().split("T")[0]
            let end_date = new Date()
            end_date.setDate(end_date.getDate() - 1)
            end_date.setFullYear(end_date.getFullYear() + 1)
            end_date = end_date.toISOString().split("T")[0];

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            if(institution_logo){
              let logo_local_path = req.files?.institution_logo[0]?.path

              if(!logo_local_path){
                return res.send({status: false, message: "Logo is required"})
              }

              const logo = await uploadOnCloudinary(logo_local_path)
              console.log('logo', logo);
              
            }
            // if(institution_logo){
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

            //         institution_logo = upload_name;
            //     } else {
            //         console.log("❌ ERROR: Base64 data missing!");
            //     }
            // }            
        
        let insertedUser = await db.collection('users').insertOne({ name: institutionName, email, phone, password: hashedPassword, role, status: 'active', createdAt: new Date()})
        await db.collection('institution').insertOne({ user_id: insertedUser.insertedId.toString(), institutionName, institutionCode, status: 'active' })

        // return res.send({ status: true, message: "Registered successfully", token })
        return res.send({status: true, message: "Registered successfully"})
        }
        
    }catch(err){
        console.log('error', err);
        return res.send({status: false, message: 'Internal server error'})        
    }    
};

exports.login = async (req, res) => {
    console.log('login', req.body);
    
    let db = getDB()
    let { email, password } = req.body 
    let user = await db.collection('users').findOne({ email })
    if(!user){
        return res.send({status: false, message: "Email not found"})
    }
    let user_status = user.status
    if(user_status == 'revoked'){
      return res.send({status: false, message: "User do not have permission to login"})
    }
    let user_pass = user.password

    const isMatch = await bcrypt.compare(password, user_pass);
    
    if(isMatch){
      let access_token = createAccessToken({id: user._id.toString(), email: email, role: user.role})
      let refresh_token = createRefreshToken({id: user._id.toString()})

      const decoded = jwt.decode(access_token, ACCESSTOKEN_SECRET)
      const role = decoded.role
      console.log('role', role);

      await db.collection('users').updateOne({_id: new ObjectId(user._id)}, {$set: {refresh_token}})

      const options = {
        httpOnly: true, // true means only server can perfrom
        secure: true //true means can be modified from frontend or server
      }

      return res
        .cookie("accessToken", access_token, options)
        .cookie("refreshToken", refresh_token, options)
        .send({ status: true, message:"User logged in successfully", role: role })
       
    } else{
      return res.send({ status: false, message: "Password incorrect" })
    }
};

exports.logout = async(req, res) => {
  console.log('logout');
  let db = getDB()

  let user_id = req.user?.id
  console.log('user_id', req.user);
  

  await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(user_id) },
    {
      $unset: {
        refresh_token: ""
      }
    }
  )

  const options = {
    httpOnly: true, // true means only server can perfrom
    secure: true //true means can be modified from frontend or server
  }

  return res
  .clearCookie('accessToken', options)
  .clearCookie('refreshToken', options)
  .send({status: true, message: "User logged out successfully"})
  
}

exports.refresh_token = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  // Step 1: Decode payload WITHOUT validating expiry
  const decoded = jwt.decode(token);
  console.log('decoded', decoded);
  
  if (!decoded)
    return res.status(401).json({ message: "Invalid token" });

  const currentTime = Math.floor(Date.now() / 1000);

  // Step 2: If NOT expired → return same token
  if (decoded.exp > currentTime) {
    return res.json({
      message: "Access token is still valid",
      accessToken: token,
      valid: true
    });
  }

  // Step 3: If expired → create new token using same JWT_SECRET
  const newToken = createToken({
    id: decoded.id,
    email: decoded.email
  });

  return res.json({
    message: "New token generated",
    accessToken: newToken,
    valid: false
  });
};

exports.profile = async(req, res)=>{
  console.log('profile');

  const accessToken = req.cookies.accessToken;

  if(!accessToken){
    return res.send({status: false, message: "User not logged in"})
  } else{
    const decoded = await jwt.decode(accessToken)
    res.send({status: true, message: "User logged in", accessToken, role: decoded.role})
  }
  
}

