import { useState, useRef } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { Course } from '../../../types/CourseType';
import { updateCourse } from '../../../backend/FirestoreCalls';
import styles from './ClassMain.module.css';
import editIcon from '../../../assets/gray-pencil.svg';
import saveIcon from '../../../assets/save.svg';
import uploadIcon from '../../../assets/upload.svg';
import certificateIcon from '../../../assets/certificate.svg';
import emailIcon from '../../../assets/email.svg';
import x from '../../../assets/x.svg';
import DescriptionIcon from '@mui/icons-material/Description';

const ClassMain = (props: {
  course: Course;
  courseID: string;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
}): JSX.Element => {
  const emailContentRef = useRef<HTMLDivElement>(null);
  const [editText, setEditText] = useState<boolean>(false);

  const handleEdit = (): void => {
    if (editText && emailContentRef.current != null) {
      const newText = emailContentRef.current.innerHTML; // Stores the HTML to preserve formatting

      if (newText !== null && newText !== undefined) {
        props.setCourse({
          ...props.course,
          introEmail: {
            content: newText,
            files: props.course.introEmail.files,
          },
        });
        updateCourse(
          {
            ...props.course,
            introEmail: {
              content: newText,
              files: props.course.introEmail.files,
            },
          },
          props.courseID,
        );
      }
    }
    setEditText(!editText);
  };

  const sendAllCertificates = () => {
    // TODO: Populate and send certificates with student and course names
  };

  return (
    <div className={styles.container}>
      <div className={styles.introCard}>
        <div className={styles.introHeader}>
          <p>Class Intro</p>
          <div className={styles.introButtons}>
            {editText && (
              <ToolTip title="Upload File" placement="top">
                <button className={styles.uploadButton}>
                  <input
                    type="file"
                    id="upload"
                    onChange={(e: any) =>
                      // TODO: Get the proper downloaded file
                      props.setCourse({
                        ...props.course,
                        introEmail: {
                          ...props.course.introEmail,
                          files: [
                            ...props.course.introEmail.files,
                            {
                              name: e!.target!.files[0].name,
                              downloadURL: URL.createObjectURL(
                                e!.target!.files[0],
                              ),
                            },
                          ],
                        },
                      })
                    }
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
            <ToolTip title={editText ? 'Save' : 'Edit'} placement="top">
              <button className={styles.editButton} onClick={handleEdit}>
                {editText ? (
                  <img src={saveIcon} alt="Save Text" className={styles.icon} />
                ) : (
                  <img src={editIcon} alt="Edit Text" className={styles.icon} />
                )}
              </button>
            </ToolTip>
          </div>
        </div>
        <div className={styles.introContent}>
          <div
            className={`${styles.introText} ${editText && styles.editing}`}
            contentEditable={editText}
            ref={emailContentRef}
            dangerouslySetInnerHTML={{
              __html: props.course.introEmail.content,
            }}
          ></div>
        </div>
        <div className={styles.fileContainer}>
          {props.course.introEmail.files.map((file) => {
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
                    props.setCourse({
                      ...props.course,
                      introEmail: {
                        ...props.course.introEmail,
                        files: props.course.introEmail.files.filter(
                          (ele) => ele != file,
                        ),
                      },
                    });
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
          <button className={styles.certificate} onClick={sendAllCertificates}>
            <img
              src={certificateIcon}
              alt="Certificate"
              className={styles.certificateIcon}
            />
          </button>
        </ToolTip>
        <ToolTip title="Send Email" placement="top">
          <button className={styles.email}>
            <img src={emailIcon} alt="Email" className={styles.emailIcon} />
          </button>
        </ToolTip>
      </div>
    </div>
  );
};

export default ClassMain;
