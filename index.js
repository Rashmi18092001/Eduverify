require('dotenv').config();

let express = require('express')
let app = express()
let cors = require('cors')
let cron = require('node-cron')
let { connectDB, getDB } = require('./services/db')
let routes = require('./routes/index')
let path = require('path')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger');


connectDB()

app.use(express.json({ limit: '50mb' }));
app.use("/logos", express.static(path.join(__dirname, "logos")));
app.use("/profile", express.static(path.join(__dirname, "profile")));
app.use("/qr", express.static(path.join(__dirname, "qr")));
app.use("/generated", express.static(path.join(__dirname, "generated")));

app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/v1', routes)

cron.schedule("0 0 * * *", async () => {

    console.log("Running certificate expiry cron...");

    try {
        const db = getDB();
        let now = new Date();
        
        let certs = await db.collection("certificates").find({ status: "active" }).toArray();

        let expiredIds = [];

        certs.forEach(cert => {
            if (cert.expiry_date) {
                let expDate = new Date(cert.expiry_date);
                
                if (expDate < now) {
                    expiredIds.push(cert._id);
                }
            }
        });

        if (expiredIds.length > 0) {
            let result = await db.collection("certificates").updateMany(
                { _id: { $in: expiredIds } },
                { $set: { status: "expired" } }
            );

            console.log(`Cron Result: ${result.modifiedCount} certificates expired.`);
        } else {
            console.log("Cron Result: 0 certificates expired.");
        }

    } catch (err) {
        console.log("Cron Error:", err);
    }
});

app.listen(3000, ()=>{
    console.log('server is listening on port 3000');    
})