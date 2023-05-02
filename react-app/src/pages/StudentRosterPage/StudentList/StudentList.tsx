import { useEffect, useState } from 'react';
import { type StudentID } from '../../../types/StudentType';
import styles from './StudentList.module.css';
import eyeIcon from '../../../assets/view.svg';
import trashIcon from '../../../assets/trash.svg';
import DeleteStudentConfirmation from './DeleteStudentConfirmation/DeleteStudentConfirmation';

const StudentList = (props: {
  search: string;
  students: Array<Partial<StudentID>>;
  setReloadList: Function;
}) => {
  const [studentList, setStudentList] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<String>();
  const [popupEmail, setPopupEmail] = useState<String>();
  const [removeStudentId, setStudentId] = useState<String>();

  const handleClick = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    const list = props.students.reduce((result: any[], student, i) => {
      const firstName = student.firstName ? student.firstName + ' ' : '';
      const middleName = student.middleName ? student.middleName + ' ' : '';
      const lastName = student.lastName ? student.lastName + ' ' : '';
      const fullName = firstName + middleName + lastName;
      const email = student.email;
      const id = student.id;
      if (fullName.toLowerCase().includes(props.search.toLowerCase())) {
        result.push(
          <div
            key={i}
            className={
              result.length === 0 ? styles.studentBoxTop : styles.studentBox
            }
          >
            <p className={styles.name}>{fullName}</p>
            <div className={styles.icons}>
              <button className={`${styles.button} ${styles.profileIcon}`}>
                <img src={eyeIcon} alt="View Profile" />
              </button>
              <button className={`${styles.button} ${styles.trashIcon}`}>
                <img
                  src={trashIcon}
                  alt="Delete Student"
                  onClick={() => {
                    setPopupEmail(email);
                    setPopupName(fullName);
                    setStudentId(id);
                    handleClick();
                  }}
                />
              </button>
            </div>
          </div>,
        );
      }

      return result;
    }, []);
    setStudentList(list);
  }, [props.search]);

  return (
    <>
      {props.students.length === 0 ? (
        <h4 className={styles.noStudent}>No Students Currently in Roster</h4>
      ) : studentList.length === 0 ? (
        <h4 className={styles.noStudent}>
          No Student Found Matching "{props.search}"
        </h4>
      ) : (
        <>
          <div className={styles.listBox}>{studentList}</div>
          {showPopup && (
            <DeleteStudentConfirmation
              open={showPopup}
              onClose={() => {
                setShowPopup(!showPopup);
              }}
              popupName={popupName ? popupName : 'undefined'}
              popupEmail={popupEmail ? popupEmail : 'undefined'}
              removeStudentId={removeStudentId ? removeStudentId : 'undefined'}
              setReloadList={props.setReloadList}
            />
          )}
        </>
      )}
    </>
  );
};

export default StudentList;
