const {db} =require('../util/admin');

const firebaseConfig =require('../util/config');
const { validateSignupData , validateLoginData } = require('../util/validator');

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);


exports.signup =  (request, response) => {
    let token, userId;
    const newUser = {
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      handle: request.body.handle
    };
    
    const { valid, errors } = validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors);
    
    //remark you must it
    db.doc(`/users/${newUser.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return response
            .status(400)
            .json({ handle: "this handle is already taken" });
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then(idToken => {
        token = idToken;
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
        return response.status(201).json({ token });
      })
      .catch(err => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          return response.status(400).json({ email: "Email is already is use" });
        }
        return response.status(500).json({ error: err.code });
      });
  };

exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };
  
    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);

    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        return data.user.getIdToken();
      })
      .then(token => {
        return res.json({ token });
      })
      .catch(err => {
        console.error(err);
        if (err.code === "auth/wrong-password") {
          return res.status(403).json({ General: "Wong Password Try Again" });
        } else return res.status(500).json({ error: err.code });
      });
  };