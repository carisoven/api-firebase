const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const  { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup , login } =require('./handlers/users');


//scream
app.get("/screams",getAllScreams);
// Write Data
app.post("/scream", FBAuth, postOneScream);

//Sign up
app.post( "/signup" , signup );
app.post( "/login" , login );

//express pass api
exports.api = functions.region("asia-east2").https.onRequest(app);