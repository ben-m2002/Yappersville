const express = require('express');
const app = express();


const port = process.argv > 2 ? process.argv[2] : 3000;

app.use(express.json());

app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

users = {}; // were going to use an object here
groups = {}; // were going to use an object here

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


apiRouter.post("/createGroup", (req, res) => {
    const group = req.body;
    // let's have a check that no groupID are the same
    if (group.id in groups){
        res.status(400).send("Error refresh page and recreate group");
        return;
    }
    groups[group.id] = group
    res.status(200).send("Success");
});

apiRouter.get("/groups", (req, res) => {
    res.status(200).send(groups);
});

apiRouter.get("findGroup", (req, res) => {
    const id = req.query.id;
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


app.use ((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

