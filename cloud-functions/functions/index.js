const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const cors = require("cors");
const corsHandler = cors({ origin: true });

/*
 * Creates a new user
 *
 * Arguments: email: string, the user's email
 *            name: string, the user's name
 *            role: string, (Options: "ADMIN", "TEACHER")
 */

exports.createUser = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const auth = admin.auth();
      await auth
        .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
        .then(async (decodedToken) => {
          if (
            req.body.data.email == null ||
            req.body.data.role == null ||
            req.body.data.name == null
          ) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "Missing arguments. Request must include email, name, and role."
            );
          } else if (decodedToken.role.toLowerCase() != "admin") {
            throw new functions.https.HttpsError(
              "permission-denied",
              "Only an admin user can create users"
            );
          } else {
            await auth
              .createUser({
                email: req.body.data.email,
                password: "defaultpassword",
              })
              .then(async (userRecord) => {
                await auth
                  .setCustomUserClaims(userRecord.uid, {
                    role: req.body.data.role,
                  })
                  .then(async () => {
                    await db
                      .collection("Users")
                      .add({
                        auth_id: userRecord.uid,
                        email: req.body.data.email,
                        name: req.body.data.name,
                        type: req.body.data.role.toUpperCase(),
                      })
                      .then(() => {
                        res.json({ result: "Complete" });
                      })
                      .catch((error) => {
                        throw new functions.https.HttpsError(
                          "Unknown",
                          "Failed to add user to database"
                        );
                      });
                  })
                  .catch((error) => {
                    throw new functions.https.HttpsError(
                      "Unknown",
                      "Failed to set user's role"
                    );
                  });
              })
              .catch((error) => {
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to add user to authorization"
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
  });

/**
 * Deletes the user
 * Argument: firebase_id - the user's firebase_id
 * TODO: Update Error Codes
 */
exports.deleteUser = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const auth = admin.auth();
      auth
        .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
        .then(async (decodedToken) => {
          if (decodedToken.role.toLowerCase() != "admin") {
            throw new functions.https.HttpsError(
              "permission-denied",
              "Only an admin user can change roles"
            );
          } else if (req.body.data.firebase_id == null) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "Missing arguments. Request must include firebase id."
            );
          } else {
            await auth
              .deleteUser(req.body.data.firebase_id)
              .then(async () => {
                const promises = [];
                await db
                  .collection("Users")
                  .where("auth_id", "==", req.body.data.firebase_id)
                  .get()
                  .then((querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Unable to find user with that firebase id in the database"
                      );
                    } else {
                      querySnapshot.forEach((documentSnapshot) => {
                        promises.push(documentSnapshot.ref.delete());
                      });
                    }
                  })
                  .catch((error) => {
                    throw new functions.https.HttpsError("unknown", `${error}`);
                  });
                await Promise.all(promises)
                  .then(() => {
                    res.json({ result: "Complete" });
                  })
                  .catch((error) => {
                    throw new functions.https.HttpsError("unknown", `${error}`);
                  });
              })
              .catch((error) => {
                throw new functions.https.HttpsError("unknown", `${error}`);
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
  });

/**
 * Updates a user's email
 * Arguments: oldEmail - the user's current email
 *            newEmail - the user's new email
 * TODO: Update Error Codes
 */
exports.updateUserEmail = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const auth = admin.auth();
      await auth
        .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
        .then(async (decodedToken) => {
          await auth
            .updateUser(decodedToken.uid, {
              email: req.body.data.newEmail,
            })
            .then(async () => {
              await db
                .collection("Users")
                .where("auth_id", "==", decodedToken.uid)
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

/**
 * Changes a user's role in both authorization and the database
 * Arguments: firebase_id - the id of the user
 *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
 */

exports.setUserRole = functions
  .region("us-east4")
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const auth = admin.auth();
      await auth
        .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
        .then(async (decodedToken) => {
          if (req.body.data.firebase_id == null || req.body.data.role == null) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "Missing arguments. Request must include firebase id and role."
            );
          } else if (decodedToken.role.toLowerCase() != "admin") {
            throw new functions.https.HttpsError(
              "permission-denied",
              "Only an admin user can change user roles"
            );
          } else {
            await auth
              .setCustomUserClaims(req.body.data.firebase_id, {
                role: req.body.data.role,
              })
              .then(async () => {
                await db
                  .collection("Users")
                  .where("auth_id", "==", req.body.data.firebase_id)
                  .get()
                  .then(async (querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Unable to find user with that firebase id in the database"
                      );
                    } else {
                      const promises = [];
                      querySnapshot.forEach((doc) => {
                        promises.push(
                          doc.ref.update({ type: req.body.data.role })
                        );
                      });
                      await Promise.all(promises)
                        .then(() => {
                          res.json({ result: "Complete" });
                        })
                        .catch(() => {
                          throw new functions.https.HttpsError(
                            "Unknown",
                            "Unable to update user role in database"
                          );
                        });
                    }
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
                  "Failed to change user role."
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
  });

/**
 * Code used to creating the first admin
 */

// exports.createFirstAdmin = functions
//   .region("us-east4")
//   .https.onRequest((req, res) => {
//     corsHandler(req, res, async () => {
//       const auth = admin.auth();
//       auth
//         .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
//         .then(async (decodedToken) => {
//           if (req.body.data.firebase_id == null) {
//             throw new functions.https.HttpsError(
//               "invalid-argument",
//               "Missing arguments. Request must include firebase id."
//             );
//           } else {
//             await auth
//               .setCustomUserClaims(req.body.data.firebase_id, { role: "ADMIN" })
//               .then(async () => {
//                 await db
//                   .collection("Users")
//                   .add({
//                     auth_id: req.body.data.firebase_id,
//                     email: "sample email",
//                     name: "sample name",
//                     type: "ADMIN",
//                   })
//                   .then(() => {
//                     res.json({ result: "Complete" });
//                   })
//                   .catch((error) => {
//                     throw new functions.https.HttpsError(
//                       "Unknown",
//                       "Failed to add user to database"
//                     );
//                   });
//               })
//               .catch((error) => {
//                 throw new functions.https.HttpsError(
//                   "Unknown",
//                   "Failed to set user's role"
//                 );
//               });
//           }
//         })
//         .catch((error) => {
//           throw new functions.https.HttpsError(
//             "unauthenticated",
//             "failed to authenticate request. ID token is missing or invalid."
//           );
//         });
//     });
//   });
