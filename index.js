//-k "/Users/benmaduabuchi/Documents/cs260.pem" -h "yappersville.click" -s "startup"

require('dotenv').config();
const database = require('./Modules/database');
const express = require('express');
const app = express();
let client = null;
let db = null;

async function establishConnections (){
    client = await database.getClient();
    db = database.getDB(client);
}


const port = process.argv > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

// aws stuff

const {S3Client, PutObjectCommand}= require('@aws-sdk/client-s3');
const {Upload} = require("@aws-sdk/lib-storage");

const s3Client = new S3Client({
   region : "us-west-1",
   accessKeyId  : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
});

const region = "us-west-1";


const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 1024 * 1024 * 2, // Max field value size in bytes (here set to 2MB)
  },
});

const apiRouter = express.Router();
app.use(`/api`, apiRouter);


dms = {}; // this stores a private message between two users


apiRouter.post('/register', async (req, res) => {
    const user = req.body
    const userInstance = await database.getUser( db, user.name);
    if (userInstance !== null) {
        res.status(400).send("User already exists");
        return;
    }
    await database.insertIntoUsers(db, user)
    res.status(200).send("Success");
});

apiRouter.post("/findUser", async (req, res) => {
    const content = req.body
    const name = content.name;
    const password = content.password;
    const userInstance = await database.getUser(db, name);
    if (userInstance === null) {
        res.status(400).send("User not found");
        return;
    }
    res.status(200).send(userInstance);
});

apiRouter.post("/updateUser", async(req, res) => {
    const user = req.body;
    const userInstance = await database.getUser(db,user.name);
    if (userInstance === null){
        res.status(400).send("User not found");
        return;
    }
    await database.updateUser(db, user);
    res.status(200).send("Success");
});


apiRouter.post("/createGroup", upload.single('profilePic'), async (req, res) => {
    const group = JSON.parse(req.body.group);
    const file = req.file

    let uploadParams = {
        Bucket: "groupimagebucket",
        Key: file.originalname,
        Body: file.buffer,
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        const uploadResult = await s3Client.send(command);
        group.profilePic = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;
        const groupInstance = await database.findGroup(db, group.id);
        if (groupInstance !== null) {
            res.status(400).send("Error refresh page and recreate group");
            return;
        }
        await database.insertIntoGroups(db, group);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: "Success", imageURL: group.profilePic });
    } catch (e) {
        console.log("Error uploading to S3", e);
        res.status(500).send("Error uploading to S3 " + e);
    }
});

apiRouter.get("/findGroup/:id", async (req, res) => {
    const id = req.params.id;
    const groupInstance = await database.findGroup(db, id);
    if (groupInstance === null) {
        res.status(400).send("Group not found");
        return;
    }
    res.status(200).send(groupInstance);
});

apiRouter.get("/userGroups", async (req, res) => {
    const userName = req.query.name;
    const userGroups = await database.findUserGroups(db, userName);
    res.status(200).send(userGroups);
});

apiRouter.post("/updateGroup", async (req, res) => {
    const group = req.body;
    const groupCollection = database.findGroup(db,group.id)
    if (groupCollection === null){
        res.status(400).send("Group not found");
        return;
    }
    await database.updateGroup(db, group);
    res.status(200).send("Success");
});

apiRouter.post('/create_dm', (req, res) => {
    // push the user to the users array
    const dm = req.body
    // make sure the user is unique
    if (dm.id in dms){
        res.status(400).send("DM already exists");
        return;
    }
    dms[dm.id] = dm;
    res.status(200).send("Success");
});

apiRouter.post("/updateDM", (req, res) => {
    const dm = req.body;
    if (!dm.id in dms){
        res.status(400).send("DM not found");
        return;
    }
    dms[dm.id] = dm;
    res.status(200).send("Success");
});

apiRouter.get("/findDM/:id", (req, res) => {
    const id = req.params.id;
    if (id in dms){
        res.status(200).send(dms[id]);
    }
    else {
        res.status(400).send("DM not found");
    }
});

app.use ((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

process.on('SIGINT', () => {
   client.close(() => {
       console.log("Database connection closed");
       process.exit(0);
   })
 });

establishConnections();