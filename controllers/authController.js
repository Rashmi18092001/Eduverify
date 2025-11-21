let jwt = require('jsonwebtoken')
let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
let fs = require('fs')
let path = require('path')

let JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
    return jwt.sign(  
      { id: user.id, email: user.email },
      JWT_SECRET,
    // { id: user.name, email: user.email },
    // JWT_SECRET,
    //   { expiresIn: JWT_EXPIRES_IN || '1d' }  
    { expiresIn: '1d' }  
    );  
};
 
  
exports.register = async (req, res) => {
    console.log('register', req.body);    
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

            if(institution_logo){
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

                    institution_logo = upload_name;
                } else {
                    console.log("❌ ERROR: Base64 data missing!");
                }
            }            
        
        let insertedUser = await db.collection('users').insertOne({ name: institutionName, email, phone, password, role, status: 'active', createdAt: new Date()})
        await db.collection('institution').insertOne({ user_id: insertedUser.insertedId.toString(), institutionName, institutionCode, institution_logo, status: 'active' })
       
        let token = createToken({id: insertedUser.insertedId.toString(), email: email})
        return res.send({ status: true, message: "Registered successfully", token })
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
    
    let token = createToken({id: user._id.toString(), email})

        if(user.password == password){
            return res.send({ status: true, message:"User logged in successfully", token })
        }
        else{
        return res.send({ status: false, message: "Password incorrect" })
        }
};

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

