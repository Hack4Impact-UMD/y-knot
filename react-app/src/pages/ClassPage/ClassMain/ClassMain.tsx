import { useState, useRef } from 'react';
import styles from './ClassMain.module.css';
import editIcon from '../../../assets/gray-pencil.svg';
import saveIcon from '../../../assets/save.svg';
import uploadIcon from '../../../assets/upload.svg';
import certificateIcon from '../../../assets/certificate.svg';
import emailIcon from '../../../assets/email.svg';

const ClassMain = (): JSX.Element => {
  const emailContentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>(
    'Hello everyone and welcome to math! In this course we will be teaching...',
  );
  const [editText, setEditText] = useState<boolean>(false);

  const handleEdit = (): void => {
    if (editText && emailContentRef.current) {
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
              <button className={styles.uploadButton}>
                <img
                  src={uploadIcon}
                  alt="Upload"
                  className={`${styles.icon} ${styles.uploadIcon}`}
                />
              </button>
            )}
            <button className={styles.editButton} onClick={handleEdit}>
              {editText ? (
                <img src={saveIcon} alt="Save Text" className={styles.icon} />
              ) : (
                <img src={editIcon} alt="Edit Text" className={styles.icon} />
              )}
            </button>
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
      </div>
      <div className={styles.buttons}>
        <button className={styles.certificate}>
          <img
            src={certificateIcon}
            alt="Certificate"
            className={styles.certificateIcon}
          />
        </button>
        <button className={styles.email}>
          <img src={emailIcon} alt="Email" className={styles.emailIcon} />
        </button>
      </div>
    </div>
  );
};

export default ClassMain;
