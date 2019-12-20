<<<<<<< Updated upstream
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyBGorxnCwD6KWwjRS5Guox0mf6QeIil__I",
    authDomain: "lab-o-f236e.firebaseapp.com",
    databaseURL: "https://lab-o-f236e.firebaseio.com",
    projectId: "lab-o-f236e",
    storageBucket: "lab-o-f236e.appspot.com",
    messagingSenderId: "402011493806",
    appId: "1:402011493806:web:43308a71d11a2a069fa43f",
    measurementId: "G-XNXJRZCSGS"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

//Show Data 
app.get('/screams',(request,response)=>{
    db
    .collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then((data)=>{
        let screams = [];
        data.forEach((doc)=>{
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return response.json(screams);
    })
    .catch((err)=> console.error(err));
});

// Write Data
app.post('/scream',(request, response) => {
    const newScream = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('screams')
        .add(newScream)
        .then(doc =>{
            response.json({message: `document ${doc.id} Created Successfully `});
        })
        .catch((err)=>{
            response.status(500).json({ error: 'Something went wrong '});
            console.error(err);
        });
});

//Sign up 
let token, userId;
app.post('/signup',(request,response) => {
    const newUser={
        email:request.body.email,
        password:request.body.password,
        confirmPassword:request.body.confirmPassword,
        handle:request.body.handle,
    };

    db.doc(`/users/${newUser.handle}`).get()
    .then((doc)=>{
        if(doc.exists){
            return response.status(400).json({ handle: 'this handle is already taken'});
        }else{
            return firebase.auth()
            .createUserWithEmailAndPassword(newUser.email,newUser.password);
        }
    })
    .then((data)=>{
        userId = data.user.uid;
        return data.user.getIdToken();

    })
    .then((idToken)=>{
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        // return response.status(201).json({ token });
    })
    .then(()=>{
        return response.status(201).json({ token });
    })
    .catch((err)=>{
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return response.status(400).json({ email: 'Email is already is use'});
        }
        return response.status(500).json({ error: err.code });
    });
});

//express pass api
exports.api = functions.region('asia-east2').https.onRequest(app);
=======
const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { getAllScreams, postOneScream } = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");

//scream
app.get("/screams", getAllScreams);
// Write Data
app.post("/scream", FBAuth, postOneScream);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user",FBAuth,getAuthenticatedUser);

//Sign up
app.post("/signup", signup);
app.post("/login", login);

//express pass api
exports.api = functions.region("asia-east2").https.onRequest(app);
>>>>>>> Stashed changes
