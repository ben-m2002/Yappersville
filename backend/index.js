const express = require('express');
const app = express();


const port = process.argv > 2 ? process.argv[2] : 3000;

app.use(express.json());

app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

users = [];
groups = [];

// Login And Registering

apiRouter.post('/register', (req, res) => {
    // push the user to the users array
    const user = req.body
    console.log(user);
    // make sure the user is unique
    for (let u of users){
        if (u.name === user.name){
            res.status(400).send("User already exists");
            return;
        }
    }
    users.push(user);
    res.status(200).send("Success");
});

apiRouter.post("/users", (req, res) => {
    const content = req.body
    const name = content.name;
    const password = content.password;
    for (let u of users){
        if (u.name === name && u.password === password){
            res.status(200).send(u);
            return;
        }
    }
    res.status(400).send("User not found");
});


app.use ((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

