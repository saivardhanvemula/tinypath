const express = require("express");
const { url } = require("inspector");
const { MongoClient } = require("mongodb");
const path = require("path");

let port = 3000;
let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);
// let client=mongodb.client();
const app = express();
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/", "index.html"));
});
app.get('/:url', async (req, res) => {
    try {
        let url=req.params.url
        console.log(url)
        await client.connect();
        const db = client.db('miniurl');
        const collection = db.collection('urls');
        const data = await collection.findOne({miniurl:url});
        console.log(data.url);
        if( data){
            res.redirect(data.url);
        }else{
            console.log("url not found");  
            res.send(`There is no miniurl for '${url}'`)
        }
        await client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Server Error'});
    }
});
app.listen(port, () => console.log("server started on port 3000"));
