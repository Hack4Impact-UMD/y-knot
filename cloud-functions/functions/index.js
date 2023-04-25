const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const cors = require("cors");
const corsHandler = cors({ origin: true });

/*
 * Creates a new user
 *
 * Arguments:
 * email: string
 * name: string
 * role: string (Options: "admin", "user")
 */
exports.createUser = functions
  .region("us-east4")
  .https.onCall(async (data, context) => {
    const auth = admin.auth();
    auth
      .verifyIdToken(data.idToken)
      .then(async (claims) => {
        // check input
        if (data.email == null || data.role == null || data.name == null) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Missing arguments. Request must include email, name, and role."
          );
        } else {
          if (claims.role != "admin") {
            throw new functions.https.HttpsError(
              "permission-denied",
              "Only an admin user can change roles"
            );
          } else {
            try {
              const userRecord = await auth.createUser({
                email: data.email,
                password: "defaultpassword",
              });

              auth.setCustomUserClaims(userRecord.uid, { role: data.role });
              db.collection("Users").add({
                auth_id: userRecord.uid,
                email: data.email,
                name: data.name,
                type: data.role.toUpperCase(),
              });
              return;
            } catch (error) {
              throw new functions.https.HttpsError("unknown", `${error}`);
            }
          }
        }
      })
      .catch((error) => {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "failed to authenticate request. ID token is missing or invalid."
        );
      });
  });

/*
 * Deletes the given user
 *
 * Arguments:
 * uid: string
 */
exports.deleteUser = functions
  .region("us-east4")
  .https.onCall(async (data, context) => {
    const auth = admin.auth();
    auth
      .verifyIdToken(data.idToken)
      .then(async (claims) => {
        // check input
        if (claims.role != "admin") {
          throw new functions.https.HttpsError(
            "permission-denied",
            "Only an admin user can change roles"
          );
        } else {
          try {
            await auth.deleteUser(data.uid);
            functions.logger.log(`Deleting user with uid: ${data.uid}`);
            return db
              .collection("Users")
              .where("auth_id", "==", data.uid)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                  documentSnapshot.ref.delete();
                });
              });
          } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError("unknown", `${error}`);
          }
        }
      })
      .catch((error) => {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "failed to authenticate request. ID token is missing or invalid."
        );
      });
  });

/*
Takes argument of form {uid: string, role: string}
Sets the role of user with the given uid to the given role
*/
exports.setUserRole = functions
  .region("us-east4")
  .https.onCall((data, context) => {
    const auth = admin.auth();
    // authenticate caller
    auth
      .verifyIdToken(data.idToken)
      .then((claims) => {
        // check input
        if (data.uid == null || data.role == null) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Must provide a uid and role"
          );
        } else {
          if (claims.role != "admin") {
            throw new functions.https.HttpsError(
              "permission-denied",
              "Only an admin user can change roles"
            );
          } else {
            auth.setCustomUserClaims(data.uid, { role: data.role });
          }
        }
      })
      .catch((error) => {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Failed to authenticate: " + error
        );
      });
  });

exports.createFirstAdmin = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    const auth = admin.auth();
    // Added new checks now that the first admin has been created.
    auth
      .verifyIdToken(data.idToken)
      .then(async (claims) => {
        // check role
        if (claims.role != "admin") {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Missing arguments. Request must include email, name, and role."
          );
        } else {
          auth
            .setCustomUserClaims("Dtqn81N7x8dBdSavtyoKuYdNn6O2", {
              role: "admin",
            })
            .then(() => {
              auth
                .getUserByEmail("sgaba@umd.edu")
                .then((userRecord) => {
                  const role = userRecord.customClaims["role"];
                  db.collection("Users").add({
                    auth_id: "Dtqn81N7x8dBdSavtyoKuYdNn6O2",
                    email: "sgaba@umd.edu",
                    name: "S",
                    type: "admin",
                  });
                  res.json({ result: `sgaba@umd.edu role is ${role}` });
                })
                .catch((error) => {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to add user to database"
                  );
                });
            })
            .catch((error) => {
              throw new functions.https.HttpsError(
                "unknown",
                "Unable to set user claims"
              );
            });
        }
      })
      .catch((error) => {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "failed to authenticate request. ID token is missing or invalid."
        );
      });
  });

exports.getUserRole = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    const auth = admin.auth();
    auth
      .verifyIdToken(data.idToken)
      .then((claims) => {
        auth
          .getUserByEmail(req.email)
          .then((userRecord) => {
            const role = userRecord.customClaims["role"];
            res.json({ result: `role for ${req.email} is ${role}` });
          })
          .catch((error) => {
            res.json({ result: error });
          });
      })
      .catch((error) => {
        res.json({ result: error });
      });
  });

// TODO: Add better error codes.
exports.updateUserEmail = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const auth = admin.auth();
      auth
        .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
        .then((decodedToken) => {
          auth
            .updateUser(decodedToken.uid, {
              email: req.body.data.newEmail,
            })
            .then(() => {
              db.collection("Users")
                .where("email", "==", decodedToken.email)
                .get()
                .then((querySnapshot) => {
                  if (querySnapshot.docs.length == 0) {
                    throw new functions.https.HttpsError(
                      "Unknown",
                      "Unable to find user with that email in the database"
                    );
                  }
                  querySnapshot.forEach((doc) => {
                    doc.ref
                      .update({ email: req.body.data.newEmail })
                      .then(() => {
                        res.json({ result: "Complete" });
                      })
                      .catch(() => {
                        throw new functions.https.HttpsError(
                          "Unknown",
                          "Unable to update user in database"
                        );
                      });
                  });
                })
                .catch((error) => {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that email in the database"
                  );
                });
            })
            .catch((error) => {
              throw new functions.https.HttpsError(
                "Unknown",
                "Unable to update user's email"
              );
            });
        })
        .catch((error) => {
          throw new functions.https.HttpsError(
            "unauthenticated",
            "failed to authenticate request. ID token is missing or invalid."
          );
        });
    });
  });
