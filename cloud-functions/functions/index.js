const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Busboy = require("busboy");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const OAuth2 = google.auth.OAuth2;
admin.initializeApp();
const db = admin.firestore();
dotenv.config();

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID, // ClientID
  process.env.OAUTH_CLIENT_SECRET, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH,
});
const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "info@yknotinc.org",
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH,
    accessToken: accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/*
 * Creates a new user.
 * Takes an object as a parameter that should contain an email, name, and a role field.
 * This function can only be called by a user with admin status
 * Arguments: email: string, the user's email
 *            name: string, the user's name
 *            role: string, (Options: "ADMIN", "TEACHER")
 */

exports.createUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.role != null &&
        data.name != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        const pass = crypto.randomBytes(32).toString("hex");
        await authorization
          .createUser({
            email: data.email,
            password: pass,
          })
          .then(async (userRecord) => {
            await authorization
              .setCustomUserClaims(userRecord.uid, {
                role: data.role,
              })
              .then(async () => {
                const collectionObject = {
                  auth_id: userRecord.uid,
                  email: data.email,
                  name: data.name,
                  type: data.role.toUpperCase(),
                };
                if (data.role.toLowerCase() == "teacher") {
                  collectionObject.courses = [];
                }
                await db
                  .collection("Users")
                  .add(collectionObject)
                  .then(async () => {
                    const msg = {
                      from: '"Y-KNOT" <info@yknotinc.org>', // sender address
                      to: data.email, // list of receivers
                      subject: "Welcome to Y-KNOT", // Subject line

                      html: `
                      <div>
                          <div style="max-width: 600px; margin: auto">
                              <br><br><br>
                              <p style="font-size: 16px">
                              Hello,<br>
                              <br>
                              Your account has been created. Welcome to the Y-KNOT Course Management Portal, as an teacher you will be able to track and manage Y-KNOT classes. 
                              You can find your credentials listed below: <br>
                              <br>
                              <span style="font-weight: 600; text-decoration: underline">Course Management Portal Information</span><br>
                              <br>
                              Username: ${data.email}<br>
                              <br>
                              Password: ${pass}<br>
                              <br>
                              Please look out for a reset password email which will allow you to reset your password for security purposes.
                              <br>
                              <br>
                              Welcome to the Y-KNOT Course Management Portal!
                          <div>
                      </div>
                          
                      `, // html body
                    };

                    await transporter
                      .sendMail(msg)
                      .then(() => {
                        resolve({ reason: "Success", text: "Success" });
                      })
                      .catch((error) => {
                        reject({
                          reason: "Intro Email Not Sent",
                          text: "User has been created, but the introduction email failed to be sent to them.",
                        });
                        throw new functions.https.HttpsError(
                          "Unknown",
                          "Unable to send introduction email to new user."
                        );
                      });
                  })
                  .catch((error) => {
                    reject({
                      reason: "Database Add Failed",
                      text: "User has been created in login, but has not been added to database.",
                    });
                    throw new functions.https.HttpsError(
                      "Unknown",
                      "Failed to add user to database"
                    );
                  });
              })
              .catch((error) => {
                reject({
                  reason: "Role Set Failed",
                  text: "User has been created, but their role was not set properly",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to set user's role"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Creation Failed",
              text: "Failed to create user. Please make sure the email is not already in use.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to create user in the auth."
            );
          });
      } else {
        reject({
          reason: "Permission Denied",
          text: "Only an admin user can create users. If you are an admin, make sure the email and name passed in are correct.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can create users. If you are an admin, make sure the email and name passed into the function are correct."
        );
      }
    });
  }
);

exports.newSubmission = functions.https.onRequest((req, res) => {
  if (req.method != "POST") {
    return res.status(405).end();
  }

  const busboy = Busboy({ headers: req.headers });

  const fields = [];
  try {
    busboy.on("field", (field, val) => {
      fields[field] = val;
    });
  } catch (error) {
    console.log(error);
  }
  functions.logger.log("going into finish");
  busboy.on("finish", () => {
    functions.logger.log("starting finsih");
    const data = JSON.parse(fields["rawRequest"]);
    functions.logger.log(data);
    const submissionId = fields["submissionID"];
    functions.logger.log(submissionId);
    const formId = fields["formID"];
    functions.logger.log(formId);
    // const firstName = data["q3_nameOf3"]["first"];
    // const lastName = data["q3_nameOf3"]["last"];
    // const email = data["q7_email"];
    // const phoneNumber = data["q6_phoneNumber"]["full"];
    // const agePreference = data["q9_name9"];
    // const interestsAndHobbies = data["q40_name40"];
    // const bestDescribes = data["q41_name41"];
    // const canHaveManyMentees = data["q39_canYou"];

    // const user = {
    //   submission_id: submissionId,
    //   first_name: firstName,
    //   last_name: lastName,
    //   email: email,
    //   phone_number: phoneNumber,
    //   stage: "NEW",
    //   age_preference: agePreference,
    //   interests_hobbies: interestsAndHobbies,
    //   best_describes: bestDescribes,
    //   can_have_multiple_mentees: canHaveManyMentees,
    //   createdAt: new Date().getTime(),
    // };

    // const db = admin.firestore();

    // db.collection("applicants")
    //   .doc(submissionId)
    //   .set(user)
    //   .then(() => {
    //     console.log("Success");
    //     return res.status(200).end();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     return res.status(400).end();
    //   });
  });

  busboy.end(req.rawBody);
});
/**
 * Deletes the user
 * Argument: firebase_id - the user's firebase_id
 */

exports.deleteUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        await authorization
          .deleteUser(data.firebase_id)
          .then(async () => {
            const promises = [];
            await db
              .collection("Users")
              .where("auth_id", "==", data.firebase_id)
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
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to find user in the database. Make sure they exist.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
            await Promise.all(promises)
              .then(() => {
                resolve({ reason: "Success", text: "Success" });
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to delete user from the database.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Deletion Failed",
              text: "Unable to delete user from login system. Make sure they exist.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Unable to delete user."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "Only an admin user can delete users. If you are an admin, make sure the account exists.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can delete users. If you are an admin, make sure the account exists."
        );
      }
    });
  }
);
/**
 * Updates a user's email
 * Arguments: email - the user's current email
 *            newEmail - the user's new email
 * TODO: Update Error Codes
 */

exports.updateUserEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.newEmail != null &&
        auth &&
        auth.token &&
        auth.token.email.toLowerCase() == data.email.toLowerCase()
      ) {
        await authorization
          .updateUser(auth.uid, {
            email: data.newEmail,
          })
          .then(async () => {
            await db
              .collection("Users")
              .where("auth_id", "==", auth.uid)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  reject({
                    reason: "Database Change Failed",
                    text: "User's email has been changed for login, but failed to find user's email within the database.",
                  });
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that email in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ email: data.newEmail }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      resolve({
                        reason: "Success",
                        text: "Successfully changed email.",
                      });
                    })
                    .catch(() => {
                      reject({
                        reason: "Database Change Failed",
                        text: "User's email has been changed for login, but failed to find user's email within the database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to change user's email within the database."
                      );
                    });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Change Failed",
                  text: "User's email has been changed for login, but failed to find user's email within the database.",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that email in the database"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Change Failed",
              text: "Failed to change user's email within the login system.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user's email."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "You do not have the correct permissions to update email."
        );
      }
    });
  }
);

/**
 * Changes a user's role in both authorization and the database.
 * Takes an object as a parameter that should contain a firebase_id field and a role field.
 * This function can only be called by a user with admin status
 * Arguments: firebase_id - the id of the user
 *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
 */

exports.setUserRole = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    const authorization = admin.auth();
    if (
      data.firebase_id != null &&
      data.role != null &&
      auth &&
      auth.token &&
      auth.token.role.toLowerCase() == "admin"
    ) {
      authorization
        .setCustomUserClaims(data.firebase_id, { role: data.role })
        .then(async () => {
          await db
            .collection("Users")
            .where("auth_id", "==", data.firebase_id)
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
                  promises.push(doc.ref.update({ type: data.role }));
                });
                await Promise.all(promises)
                  .then(() => {
                    return { result: "OK" };
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
                "Unable to find user with that firebase id in the database"
              );
            });
        })
        .catch((error) => {
          throw new functions.https.HttpsError(
            "Unknown",
            "Failed to change user role."
          );
        });
    } else {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
      );
    }
  }
);
