const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('./dbConfig.json');
const uri = `mongodb+srv://${config.username}:${config.password}@${config.hostname}/?retryWrites=true&w=majority`;

async function getClient (){
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect();
    return client;
}

function getDB (client){
    return client.db(config.dbName);
}


async function getUser (db, username){
    const users = db.collection("users");
    const query = {name: username};
    return await users.findOne(query);
}

async function getUserByAuthToken (db, authToken){
    const users = db.collection("users");
    const query = {token: authToken};
    return await users.findOne(query);
}

async function insertIntoUsers (db, user){
    const users = db.collection("users");
    await users.insertOne(user);
}

async function updateUser (db, user){
    const users = db.collection("users");
    let updateUser = {...user};
    delete updateUser._id
    const query = { name: user.name};
    const newVersion = { $set: updateUser};
    await users.updateOne(query, newVersion);
}



async function insertIntoGroups (db, group){
    const groups = db.collection("groups");
    await groups.insertOne(group);
}

async function findGroup (db, groupID){
    const groups = db.collection("groups");
    const query = {id: groupID};
    return await groups.findOne(query);
}


async function findUserGroups (db, username){
    const groups = db.collection("groups");
    const query = {members: {$in : [username]}};
    return await groups.find(query).toArray();
}


async function updateGroup (db, group){
    const groups = db.collection("groups");
    let updateGroup = {...group};
    delete updateGroup._id;
    const query = { id: group.id};
    const newVersion = { $set: updateGroup};
    await groups.updateOne(query, newVersion);
}

async function insertIntoDMs (db, dm){
    const dms = db.collection("dms");
    await dms.insertOne(dm);
}

async function findDM (db, dmID){
    const dms = db.collection("dms");
    const query = {id: dmID};
    return await dms.findOne(query);
}

async function updateDM (db, dm){
    const dms = db.collection("dms");
    let updateDM = {...dm};
    delete updateDM._id;
    const query = { id: dm.id};
    const newVersion = { $set: updateDM};
    await dms.updateOne(query, newVersion);
}

async function findUserDMS (db, username){
    const dms = db.collection("dms");
    const query = {members: {$in : [username]}};
    return await dms.find(query).toArray();
}

module.exports =  {
    getClient,
    getDB,
    getUser,
    insertIntoUsers,
    updateUser,
    findGroup,
    insertIntoGroups,
    findUserGroups,
    updateGroup,
    insertIntoDMs,
    findDM,
    updateDM,
    getUserByAuthToken,
    findUserDMS,
}

