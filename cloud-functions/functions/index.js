const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall, onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Busboy = require("busboy");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const stringSimilarity = require("string-similarity");
const { WriteBatch } = require("firebase-admin/firestore");
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
    user: "yknotincmentors@gmail.com",
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

// Sends an email if the jotform submission handler catches an error
const sendNewSubmissionErrorEmail = async (formId, submissionId) => {
  const msg = {
    from: '"Y-KNOT" <info@yknotinc.org>', // sender address
    to: "sgaba@terpmail.umd.edu", // list of receivers
    subject: "YKnot Course Management Portal Submission Error", // Subject line

    html: `
      <div>
          <div style="max-width: 600px; margin: auto">
              <br><br><br>
              <p style="font-size: 16px">
              Hello,<br>
              <br>
              A student who submitted the following form could not be added to a class
              in the course management portal. There are many possible causes for this error such
              as a class not existing, the student signing up after the class' start date, and more.
              <br>
              The form and submission ids of the submission are included below.
              
              
              Form Id: ${formId}<br>
              <br>
              Submission Id: ${submissionId}<br>
              <br>
              Please try to add the student to the class manually.
              <br>
              <br>
              
          <div>
      </div>
          
      `, // html body
  };
  await transporter.sendMail(msg).catch((error) => {
    console.log(
      "Error occured with new submission. Email also could not be sent."
    );
    console.log(error);
  });
};

exports.newSubmission = onRequest(
  { region: "us-east4", cors: true },
  async (req, res) => {
    let submissionId = undefined;
    let formId = undefined;
    try {
      if (req.method != "POST") {
        throw new Error();
      }
      const busboy = Busboy({ headers: req.headers });
      const fields = [];
      busboy.on("field", (field, val) => {
        fields[field] = val;
      });

      busboy.on("finish", async () => {
        // Once all the fields have been read, we can start processing
        const data = JSON.parse(fields["rawRequest"]);
        submissionId = fields["submissionID"];
        formId = fields["formID"];

        // First find the class with the corresponding form id
        const selectedClass = await db
          .collection("Courses")
          .where("formId", "==", formId)
          .get()
          .then(async (querySnapshot) => {
            if (querySnapshot.docs.length == 0) {
              await sendNewSubmissionErrorEmail(formId, submissionId).finally(
                () => {
                  throw new Error();
                }
              );
            } else {
              // We make sure that the class is an upcoming one
              const matchingClass = querySnapshot.docs.find((doc) => {
                const sampleClass = doc.data();

                // This finds the current date in the EST timezone
                const currentAmericanDate = new Date().toLocaleDateString(
                  "en-US",
                  {
                    timeZone: "America/New_York",
                  }
                );
                const currentFormattedDate = new Date(
                  currentAmericanDate
                ).toLocaleDateString("fr-CA");
                if (
                  sampleClass.startDate.toString() >=
                  currentFormattedDate.toString()
                ) {
                  return sampleClass;
                }
              });
              if (matchingClass) {
                return matchingClass;
              }
              // No class found, throw an error
              await sendNewSubmissionErrorEmail(formId, submissionId).finally(
                () => {
                  throw new Error();
                }
              );
            }
          });

        const studentBirth =
          data["q15_dateOf"]["year"] +
          "-" +
          data["q15_dateOf"]["month"] +
          "-" +
          data["q15_dateOf"]["day"];

        let possibleStudentMatches = [];

        // Next we check if the student exists in the database
        const matchingStudent = await db
          .collection("Students")
          .where("birthDate", "==", studentBirth)
          .get()
          .then(async (querySnapshot) => {
            if (querySnapshot.docs.length == 0) {
              return undefined;
            } else {
              const student = querySnapshot.docs.find((doc) => {
                const studentData = doc.data();
                const formName =
                  data["q3_name"]["first"].toLowerCase() +
                  data["q3_name"]["middle"].toLowerCase() +
                  data["q3_name"]["last"].toLowerCase();
                const databaseName =
                  studentData.firstName.toLowerCase() +
                  (studentData.middleName || "").toLowerCase() +
                  studentData.lastName.toLowerCase();

                // We check for similarity in order to suggest whether two students might be the same
                const similarity = stringSimilarity.compareTwoStrings(
                  formName,
                  databaseName
                );
                if (similarity == 1) {
                  return doc;
                } else if (similarity > 0.35) {
                  possibleStudentMatches.push(doc.id);
                }
              });
              if (student) {
                /* If the student already exists, we don't need to indicate possible matches
                   as that was already done when the student was first created
                */
                possibleStudentMatches = [];
              }
              return student;
            }
          });
        const student = {
          firstName: data["q3_name"]["first"],
          middleName: data["q3_name"]["middle"],
          lastName: data["q3_name"]["last"],
          addrFirstLine: data["q12_address"]["addr_line1"],
          addrSecondLine: data["q12_address"]["addr_line2"],
          city: data["q12_address"]["city"],
          state: data["q12_address"]["state"],
          zipCode: data["q12_address"]["postal"],
          email: data["q4_email"],
          phone: parseInt(
            data["q5_phoneNumber"]["full"].replace(/[\(\)-\s]/g, "")
          ),
          guardianFirstName:
            data["q14_areYou"] != "Minor"
              ? ""
              : data["q9_guardianName"]["first"],
          guardianLastName:
            data["q14_areYou"] != "Minor"
              ? ""
              : data["q9_guardianName"]["last"],
          guardianEmail:
            data["q14_areYou"] != "Minor" ? "" : data["q10_guardianEmail"],
          guardianPhone:
            data["q14_areYou"] != "Minor"
              ? ""
              : parseInt(
                  data["q11_guardianPhone"]["full"].replace(/[\(\)-\s]/g, "")
                ),
          birthDate:
            data["q15_dateOf"]["year"] +
            "-" +
            data["q15_dateOf"]["month"] +
            "-" +
            data["q15_dateOf"]["day"], // "YYYY-MM-DD"
          gradeLevel: data["q14_areYou"] != "Minor" ? "" : data["q8_grade"],
          schoolName: data["q14_areYou"] != "Minor" ? "" : data["q6_nameOf"],
          courseInformation: [
            {
              id: selectedClass.id,
              attendance: [],
              homeworks: [],
              progress: "NA",
            },
          ],
        };

        // Update the current student's course information if there is a match
        if (matchingStudent) {
          student.courseInformation = matchingStudent.data().courseInformation;
          const studentClass = matchingStudent
            .data()
            .courseInformation.find((course) => {
              course.id == selectedClass.id;
            });
          if (!studentClass) {
            student.courseInformation.push({
              id: selectedClass.id,
              attendance: [],
              homeworks: [],
              progress: "NA",
            });
          }
        }

        const batch = new WriteBatch(db);
        // Creates a new auto-generated id
        const studentRef = matchingStudent
          ? matchingStudent.ref
          : db.collection("Students").doc();
        batch.set(studentRef, student);

        const studentId = matchingStudent
          ? matchingStudent.id
          : studentRef._path.segments[1];

        // Update the class's students
        const classStudents = selectedClass.data().students || [];
        if (!classStudents.includes(studentId)) {
          classStudents.push(studentId);
        }

        batch.update(selectedClass.ref, { students: classStudents });

        if (possibleStudentMatches.length > 0) {
          const docRef = db.collection("StudentMatches").doc();
          batch.set(docRef, {
            studentOne: studentId,
            matches: possibleStudentMatches,
          });
        }

        await batch.commit().catch(async () => {
          await sendNewSubmissionErrorEmail(formId, submissionId).finally(
            () => {
              throw new Error();
            }
          );
        });

        res.end();
      });
      busboy.end(req.rawBody);
    } catch (error) {
      res.end();
    }
  }
);
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
