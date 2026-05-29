let { getDB } = require('../services/db')
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path")
const QRCode = require('qrcode')
const {uploadOnCloudinary} = require('../utils/cloudinary')

let logoUrl = process.env.LOGO_URL;
let pdfUrl = process.env.PDF_URL;
let qrUrl = process.env.QR_URL;

async function generatePDF(htmlContent, outputPath) {
  const browser = global.browserInstance

  console.log('browser-----------', browser);
  
  const page = await browser.newPage()

  page.setDefaultNavigationTimeout(0)

  await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 0
  })
  
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png'
  });

  await page.close();
  console.log("PDF generated successfully at:", outputPath);
}

exports.generate_pdf = async (req, res) => {
  console.log("generate_pdf", req.body);
  let db = getDB();

  try {
    let certificate_id = req.body.certificate_id;

    let certificate_data = await db.collection("certificates")
      .findOne({ _id: new ObjectId(certificate_id) });

    if (!certificate_data) {
      return res.send({ status: false, message: "Certificate not found" });
    }

    let stud_id = certificate_data.student_id;
    let issue_date = certificate_data.issue_date;
    // let qr_image = qrUrl + certificate_data.qr_image;
    let qr_image = certificate_data.qr_url;

    console.log('qr_image----', qr_image);
    
    let course_id = certificate_data.course_id;
    let course_name = ""
    let course_duration = ""
    let course_data = await db.collection("courses").findOne({ _id: new ObjectId(course_id) })
    if(course_data){
      course_name = course_data.name
      course_duration = course_data.duration
    }
    
    let student_data = await db.collection("students")
      .findOne({ _id: new ObjectId(stud_id) });

    if (!student_data) {
      return res.send({ status: false, message: "Student not found" });
    }

    let student_name = student_data.name;
    let inst_id = student_data.institution_id;

    let inst_data = await db.collection("institution")
      .findOne({ _id: new ObjectId(inst_id) });

    if (!inst_data) {
      return res.send({ status: false, message: "Institution not found" });
    }

    let inst_logo = inst_data.institution_logo 
    let inst_name = inst_data.institutionName;

    let html = fs.readFileSync("./template.html", "utf8");

    html = html
      .replace("{{student_name}}", student_name)
      .replace("{{course_name}}", course_name)
      .replace("{{course_duration}}", course_duration)
      .replace("{{certificate_id}}", certificate_id)
      .replace("{{issue_date}}", issue_date)
      .replace("{{inst_logo}}", inst_logo)
      .replace("{{inst_name}}", inst_name)
      .replace("{{qr_image}}", qr_image);

    const generatedFolder = path.join(__dirname, "../generated");

    if (!fs.existsSync(generatedFolder)) fs.mkdirSync(generatedFolder);

    const randomNumber = [...Array(6)].reduce((a, _) => a + '0123456789'[~~(Math.random() * 10)], '');
    let new_student_name = student_name.replace(/ /g, '_')
    let image_name = `${new_student_name}_${randomNumber}-certificate.png`
    const outputFile = path.join(generatedFolder, image_name);

    await generatePDF(html, outputFile); 
    const imgUpload = await uploadOnCloudinary(
      outputFile
    );

    if (!imgUpload) {
      return res.send({
        status: false,
        message: "PDF upload failed"
      });
    }

    console.log('imgUpload', imgUpload);
    
    await db.collection("certificates").updateOne({_id: new ObjectId(certificate_id)}, {$set: {certificate_image: image_name, certificate_url: pdfUpload.secure_url}})
    console.log('-------------------pdf generated------------------');
    
    return res.send({ status: true, message: "PDF generated successfully", certificate_url: imgUpload.secure_url  })

  } catch (err) {
    // console.log("error", err);
    console.error("generate pdf ERROR:");
    console.error(error);
    console.error(error.stack);
    return res.send({ status: false, message: "Internal server error" });
  }
};