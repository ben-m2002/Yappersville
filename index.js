//-k "/Users/benmaduabuchi/Documents/cs260.pem" -h "yappersville.click" -s "startup"

require('dotenv').config();
const express = require('express');
const app = express();



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


users = {}; // were going to use an object here
groups = {}; // were going to use an object here
dms = {}; // this stores a private message between two users

// Login And Registering

apiRouter.post('/register', (req, res) => {
    // push the user to the users array
    const user = req.body
    // make sure the user is unique
    if (user.name in users){
        res.status(400).send("User already exists");
        return;
    }
    users[user.name] = user;
    res.status(200).send("Success");
});

apiRouter.post("/users", (req, res) => {
    const content = req.body
    const name = content.name;
    const password = content.password;
    if (name in users){
        if (users[name].password === password){
            res.status(200).send(users[name]);
            return;
        }
    }
    res.status(400).send("User not found");
});

apiRouter.post("/updateUser", (req, res) => {
    const user = req.body;
    // make sure this is a user that exists
    if (!user.name in users || users[user.name].password !== user.password){
        res.status(400).send("User not found");
        return;
    }
    users[user.name] = user; // overwrite current
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
        if (group.id in groups) {
            res.status(400).send("Error refresh page and recreate group");
            return;
        }
        groups[group.id] = group
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: "Success", imageURL: group.profilePic });
    } catch (e) {
        console.log("Error uploading to S3", e);
        res.status(500).send("Error uploading to S3 " + e);
    }
});

apiRouter.get("/groups", (req, res) => {
    res.status(200).send(groups);
});

apiRouter.get("/findGroup/:id", (req, res) => {
    const id = req.params.id;
    if (id in groups){
        res.status(200).send(groups[id]);
    }
    else {
        res.status(400).send("Group not found");
    }
});

apiRouter.get("/userGroups", (req, res) => {
    const userName = req.query.name;
    let user = users[userName];
    let groupIds = user.groups;
    let userGroups = [];
    console.log(groups)
    for (let id of groupIds){
        userGroups.push(groups[id]);
    }
    res.status(200).send(userGroups);
});

apiRouter.post("/updateGroup", (req, res) => {
    const group = req.body;
    if (!group.id in groups){
        res.status(400).send("Group not found");
        return;
    }
    groups[group.id] = group;
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

