const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");
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
//showscream
app.get("/scream/:screamId", getScream);
// delete scream
app.delete("/scream/:screamId", FBAuth, deleteScream);
//Like and Unlike scream
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
//comment
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

//Sign up
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

//express pass api
exports.api = functions.region("asia-east2").https.onRequest(app);
