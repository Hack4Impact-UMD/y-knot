import { useState, useRef } from 'react';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { IntroEmailFile } from '../../../types/CourseType';
import styles from './ClassMain.module.css';
import editIcon from '../../../assets/gray-pencil.svg';
import saveIcon from '../../../assets/save.svg';
import uploadIcon from '../../../assets/upload.svg';
import certificateIcon from '../../../assets/certificate.svg';
import emailIcon from '../../../assets/email.svg';
import x from '../../../assets/x.svg';
import DescriptionIcon from '@mui/icons-material/Description';

const ClassMain = (): JSX.Element => {
  const emailContentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>(
    'Hello everyone and welcome to math! In this course we will be teaching...',
  );
  const [editText, setEditText] = useState<boolean>(false);
  const [files, setFiles] = useState<{
    uploaded: File[];
    deleted: IntroEmailFile[];
  }>({
    uploaded: [],
    deleted: [],
  });

  const handleEdit = (): void => {
    if (editText && emailContentRef.current != null) {
      const newText = emailContentRef.current.innerHTML; // Stores the HTML to preserve formatting

      if (newText !== null && newText !== undefined) {
        setText(newText);
      }
    }
    setEditText(!editText);
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
                      setFiles({
                        ...files,
                        uploaded: [...files.uploaded, e!.target!.files[0]],
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
            dangerouslySetInnerHTML={{ __html: text }}
          ></div>
        </div>
        <div className={styles.fileContainer}>
          {files.uploaded?.map((file) => {
            return (
              <div className={styles.containerLines}>
                <div className={styles.informationText}>
                  <DescriptionIcon />
                  {file.name.length > 30
                    ? file.name.substring(0, 28) +
                      '. . . ' +
                      file.name.substring(file.name.indexOf('.') - 3)
                    : file.name}
                </div>
                <button
                  onClick={() => {
                    setFiles({
                      ...files,
                      uploaded: files.uploaded.filter((ele) => ele != file),
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
          <button className={styles.certificate}>
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
