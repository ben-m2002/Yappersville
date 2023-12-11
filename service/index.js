//-k "/Users/benmaduabuchi/Documents/cs260.pem" -h "yappersville.click" -s "startup"

// Todo


// 1  Add way to find group ID
// 2. Make sure no one can go to DM without having a D
// 3. Add a way to delete a group
// 4. Add a way to delete a DM

// Maybe

// Improve logout functionality

require('dotenv').config();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const database = require('./Modules/database');
const config = require("./config.json");
const express = require('express');
const app = express();
let client = null;
let db = null;

async function establishConnections (){
    client = await database.getClient();
    db = await database.getDB(client);
    IO_SOCKET(io, db, config.COOKIES_SECRET_KEY);
}


const port = process.argv > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(express.static('public'));

app.use(cookieParser(config.COOKIES_SECRET_KEY));

// websocket stuff

const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server);
let IO_SOCKET = require("./Modules/Socket.js");

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



apiRouter.post('/register', async (req, res) => {
    const content = req.body
    const passwordHash = await bcrypt.hash(content.password, 10);
    const authToken = uuid.v4();
    const user = {
        name : content.name,
        password : passwordHash,
        chats : {
            author: content.name,
        },
        role : "user",
        token : authToken,
        groups : [],
        currentGroup : null, // current group the user has picked
        currentDM : null,
    }
    const userInstance = await database.getUser(db, user.name);
    if (userInstance !== null) {
        res.status(400).send("User already exists");
        return;
    }
    await database.insertIntoUsers(db, user)
    setAuthCookie(res, user.token);
    res.status(200).send(user);
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
    const passwordMatch = await bcrypt.compare(password, userInstance.password);
    if (!passwordMatch) {
        res.status(400).send("Invalid password");
        return;
    }
    setAuthCookie(res, userInstance.token);
    res.status(200).send(userInstance);
});

apiRouter.get("/findUserByToken", async (req, res) => {
    const authToken = req.signedCookies["auth"];
    const userCollection = await database.getUserByAuthToken(db, authToken);
    if (userCollection === null) {
        res.status(400).send("User not found");
        return;
    }
    res.status(200).send(userCollection);
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

apiRouter.get("/logout", async (req, res) => {
    res.cookie('auth', '', { expires: new Date(0), signed: true });
    res.status(200).send('Signed cookie deleted');
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
    const groupCollection = await database.findGroup(db,group.id)
    if (groupCollection === null){
        res.status(400).send("Group not found");
        return;
    }

    // only call emit socket when users in group changes:
    const newUsers = group.members
    const oldUsers = groupCollection.members

    if (newUsers.length !== oldUsers.length){
        console.log("emitting update users")
       io.to(group.id).emit("update users", group.members);
    }

    await database.updateGroup(db, group);
    res.status(200).send("Success");
});

apiRouter.post('/create_dm', async (req, res) => {
    const dm = req.body
    const dmCollection = await database.findDM(db, dm.id)
    if (dmCollection !== null) {
        res.status(400).send("DM already exists");
        return;
    }
    await database.insertIntoDMs(db, dm);
    res.status(200).send("Success")
});

apiRouter.post("/updateDM", async (req, res) => {
    const dm = req.body;
    const dmCollection = await database.findDM(db,dm.id)
    if (dmCollection === null){
        res.status(400).send("DM not found");
        return;
    }
    await database.updateDM(db, dm);
    res.status(200).send("Success");
});

apiRouter.get("/findDM/:id", async (req, res) => {
    const id = req.params.id;
    const dmCollection = await database.findDM(db, id);
    if (dmCollection === null) {
        res.status(400).send("DM not found");
        return;
    }
    res.status(200).send(dmCollection);
});

apiRouter.get("/getUserDMS/:userName", async (req, res) => {
    const userName = req.params.userName;
    const userDMs = await database.findUserDMS(db, userName);
    if (userDMs === null) {
        res.status(400).send("User has no dms");
        return;
    }
    res.status(200).send(userDMs);
});

app.use ((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

function setAuthCookie (res, token) {
    res.cookie('auth', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
        signed: true,
    });
}

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

process.on('SIGINT', () => {
   client.close(() => {
       console.log("Database connection closed");
       process.exit(0);
   })
 });

establishConnections();