import DescriptionIcon from '@mui/icons-material/Description';
import { Alert, Snackbar } from '@mui/material';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useState } from 'react';
import certificateIcon from '../../../assets/certificate.svg';
import emailIcon from '../../../assets/email.svg';
import editIcon from '../../../assets/gray-pencil.svg';
import saveIcon from '../../../assets/save.svg';
import sendEmailIcon from '../../../assets/send-email.svg';
import transcriptIcon from '../../../assets/transcript.svg';
import uploadIcon from '../../../assets/upload.svg';
import x from '../../../assets/x.svg';
import {
  sendCertificateEmail,
  sendEmail,
} from '../../../backend/CloudFunctionsCalls';
import { updateCourse } from '../../../backend/FirestoreCalls';
import Loading from '../../../components/LoadingScreen/Loading';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { Course, IntroEmailFile } from '../../../types/CourseType';
import { StudentID } from '../../../types/StudentType';
import styles from './ClassMain.module.css';

const ClassMain = (props: {
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
  students: Array<StudentID>;
}): JSX.Element => {
  const [innerText, setInnerText] = useState<string>(
    props.course.introEmail.content,
  );
  const [editText, setEditText] = useState<boolean>(false);
  const [certSuccess, setCertSuccess] = useState<string>('');
  const [emailMode, setEmailMode] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const [files, setFiles] = useState<
    {
      name: string;
      ref: string;
      downloadURL: string;
      content?: any;
    }[]
  >(props.course.introEmail.files);
  const storage = getStorage();
  const mimeTypes: { [key: string]: string } = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    png: 'image/png',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt: 'application/vnd.ms-powerpoint',
    gif: 'image/gif',
    csv: 'text/csv',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    txt: 'text/plain',
    xml: 'application/xml',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  const handleEdit = async () => {
    if (!editText) {
      setEditText(!editText);
      return;
    }
    if (innerText == null && files.length == 0) {
      setAlertMessage('No Email Content');
      return;
    }
    if (emailMode) {
      const promises: any[] = [];
      props.students.map((student) => {
        promises.push(
          sendEmail(
            student.email,
            props.course.name,
            innerText,
            files.map((f) => {
              return {
                name: f.name,
                content: btoa(
                  new Uint8Array(f.content).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                  ),
                ),
              };
            }),
          ),
        );
      });
      await Promise.all(promises)
        .then(() => {
          setAlertMessage('Emails Sent');
          setInnerText('');
          setFiles([]);
        })
        .catch((error) => {
          setAlertMessage('Error Sending Emails');
        });
    } else {
      // Get deleted files
      const deletePromises: any[] = [];
      props.course.introEmail.files.map((file) => {
        if (!files.some((f) => f.ref === file.ref)) {
          // Create a reference to the file to delete
          const desertRef = ref(storage, file.ref);

          // Delete the file
          deletePromises.push(deleteObject(desertRef));
        }
      });
      await Promise.all(deletePromises).catch((error) => {});

      const changedFiles: IntroEmailFile[] = [];
      // Get added files
      await Promise.all(
        files.map(async (file) => {
          if (file.ref == '') {
            const fileExtension = file.name.split('.').pop();
            // Upload file to firebase storage
            const randomName = crypto.randomUUID();

            const storageRef = ref(storage, randomName + '.' + fileExtension);

            await uploadBytes(storageRef, new Uint8Array(file.content));
            const downloadURL = await getDownloadURL(storageRef);
            changedFiles.push({
              name: file.name,
              ref: randomName + '.' + fileExtension,
              downloadURL: downloadURL,
            });
          } else {
            changedFiles.push(file);
          }
        }),
      );
      // Upload file to firebase storage
      await updateCourse(
        {
          introEmail: {
            content: innerText,
            files: changedFiles,
          },
        },
        props.courseID,
      )
        .then(() => {
          setAlertMessage('Changed Course Intro');
          props.setCourse({
            ...props.course,
            introEmail: { content: innerText, files: changedFiles },
          });
          setFiles(changedFiles);
          setEditText(!editText);
        })
        .catch((error) => {
          setAlertMessage('Error Changing Course Intro');
        });
    }
  };

  const sendAllCertificates = async () => {
    setCertSuccess('Loading');
    const promises: any[] = [];
    props.students.map((student) => {
      const fullStudentName =
        student.firstName +
        ' ' +
        (student.middleName ? student.middleName + ' ' : '') +
        student.lastName;
      promises.push(
        sendCertificateEmail(student.email, fullStudentName, props.course.name),
      );
    });
    await Promise.all(promises)
      .then(() => {
        setCertSuccess('Success');
      })
      .catch((error) => {
        setCertSuccess('Error');
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.introCard}>
        <div className={styles.introHeader}>
          <p>{emailMode ? 'New Class Email' : 'Class Intro'}</p>
          <div className={styles.introButtons}>
            {editText && (
              <ToolTip title="Upload File" placement="top">
                <button className={styles.uploadButton}>
                  <input
                    type="file"
                    id="upload"
                    accept=".csv, .doc, .docx, .gif, .jpeg, .jpg, .mp3, .mp4, .pdf, .png, .ppt, .pptx, .txt, .xls, .xlsx, .xml"
                    onChange={async (e: any) => {
                      const maxFileSize = 1048576 * 20; // 20MB
                      if (e.target.files) {
                        const currFile = e.target.files[0];
                        if (e.target.files![0].size > maxFileSize) {
                          alert('File is too big');
                          e.target.value = '';
                          return;
                        }
                        const exten: string = currFile.name.split('.').pop();
                        if (
                          !currFile.name.includes('.') ||
                          mimeTypes[exten] != currFile.type
                        ) {
                          alert('File extension does not match file type');
                          e.target.value = '';
                          return;
                        }
                        currFile.downloadURL = URL.createObjectURL(currFile);
                        const fileContent = await currFile.arrayBuffer();

                        setFiles([
                          ...files,
                          {
                            name: currFile.name,
                            downloadURL: currFile.downloadURL,
                            content: fileContent,
                            ref: '',
                          },
                        ]);
                      }
                    }}
                    hidden
                  />
                  <label htmlFor="upload" className={styles.editButton}>
                    <img
                      src={uploadIcon}
                      alt="Upload"
                      className={`${styles.icon} ${styles.uploadIcon}`}
                    />
                  </label>
                </button>
              </ToolTip>
            )}
            <ToolTip
              title={
                editText ? (emailMode ? 'Send Email' : 'Save Changes') : 'Edit'
              }
              placement="top"
            >
              <button className={styles.editButton} onClick={handleEdit}>
                {editText ? (
                  !emailMode ? (
                    <img
                      src={saveIcon}
                      alt={'Save Changes'}
                      className={styles.icon}
                    />
                  ) : (
                    <img
                      src={sendEmailIcon}
                      alt={'Send Email'}
                      className={styles.icon}
                    />
                  )
                ) : (
                  <img src={editIcon} alt="Edit Text" className={styles.icon} />
                )}
              </button>
            </ToolTip>
          </div>
        </div>
        <div className={styles.introContent}>
          <textarea
            className={`${styles.introText} ${editText && styles.editing}`}
            disabled={!editText}
            value={innerText}
            onChange={(e) => setInnerText(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.fileContainer}>
          {files.map((file: any) => {
            return (
              <div className={styles.containerLines}>
                <a
                  href={file.downloadURL}
                  className={styles.informationText}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DescriptionIcon />
                  {file.name.length > 30
                    ? file.name.substring(0, 28) +
                      '. . . ' +
                      file.name.substring(file.name.indexOf('.') - 3)
                    : file.name}
                </a>
                <button
                  onClick={() => {
                    setFiles(files.filter((f: any) => f.name !== file.name));
                  }}
                  className={styles.deleteButton}
                  hidden={!editText}
                >
                  <img className={styles.icon} alt="Delete Icon" src={x} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.buttons}>
        <ToolTip title="Send All Certificates" placement="top">
          <button
            className={styles.certificate}
            onClick={sendAllCertificates}
            disabled={certSuccess == 'Loading'}
          >
            {certSuccess === 'Loading' ? (
              <Loading />
            ) : (
              <img
                src={certificateIcon}
                alt="Certificate"
                className={styles.certificateIcon}
              />
            )}
          </button>
        </ToolTip>
        <ToolTip
          title={emailMode ? 'Set Class Intro' : 'New Class Email'}
          placement="top"
        >
          <button
            className={styles.email}
            onClick={() => {
              if (emailMode) {
                setInnerText(props.course.introEmail.content);
                setFiles(props.course.introEmail.files);
                setEditText(false);
              } else {
                setInnerText('');
                setFiles([]);
                setEditText(true);
              }
              setEmailMode(!emailMode);
            }}
          >
            <img
              src={emailMode ? transcriptIcon : emailIcon}
              alt="Email"
              className={styles.emailIcon}
            />
          </button>
        </ToolTip>
      </div>
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={certSuccess == 'Success' || certSuccess == 'Error'}
        autoHideDuration={3000}
        onClose={() => setCertSuccess('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Certificates Were Successfully Sent
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={alertMessage !== ''}
        autoHideDuration={3000}
        onClose={() => setAlertMessage('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClassMain;
