import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TeacherID } from '../../../types/UserType';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import styles from './TeacherList.module.css';
import eyeIcon from '../../../assets/view.svg';
import trashIcon from '../../../assets/trash.svg';
import DeleteTeacherConfirmation from './DeleteTeacherConfirmation/DeleteTeacherConfirmation';

const TeacherList = (props: {
  search: string;
  teachers: Array<Partial<TeacherID>>;
  setTeachers: Function;
  setOpenSuccess: Function;
  setOpenFailure: Function;
}) => {
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState<String>();
  const [popupEmail, setPopupEmail] = useState<String>();
  const [removeTeacherId, setRemoveTeacherId] = useState<String>();
  const [reloadList, setReloadList] = useState<Boolean>(false);
  const [numToShow, setNumToShow] = useState<number>(50);
  const navigate = useNavigate();
  const handleClick = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    setReloadList(false);

    const list = props.teachers.reduce((result: any[], teacher, i) => {
      const fullName = teacher.name;
      const email = teacher.email;
      const id = teacher.id;
      if (fullName!.toLowerCase().includes(props.search.toLowerCase())) {
        result.push(
          <div
            key={i}
            className={
              result.length === 0 ? styles.studentBoxTop : styles.studentBox
            }
          >
            <p className={styles.name}>{fullName}</p>
            <div className={styles.icons}>
              <ToolTip title="View Profile" placement="top">
                <button className={`${styles.button} ${styles.profileIcon}`}>
                  <img
                    src={eyeIcon}
                    alt="View Profile"
                    onClick={() => {
                      navigate(`/teachers/${id}`);
                    }}
                  />
                </button>
              </ToolTip>
              <ToolTip title="Remove" placement="top">
                <button className={`${styles.button} ${styles.trashIcon}`}>
                  <img
                    src={trashIcon}
                    alt="Delete Teacher"
                    onClick={() => {
                      setPopupEmail(email);
                      setPopupName(fullName);
                      setRemoveTeacherId(teacher.auth_id);
                      handleClick();
                    }}
                  />
                </button>
              </ToolTip>
            </div>
          </div>,
        );
      }
      return result;
    }, []);
    setTeacherList(list);
  }, [props.search, reloadList]);

  const handleLoadMore = () => {
    if (numToShow + 50 > props.teachers.length) {
      setNumToShow(props.teachers.length);
    } else {
      setNumToShow(numToShow + 50);
    }
  };

  return (
    <>
      {props.teachers.length === 0 ? (
        <h4 className={styles.noStudent}>No Teachers Currently in Roster</h4>
      ) : teacherList.length === 0 ? (
        <h4 className={styles.noStudent}>
          No Teacher Found Matching "{props.search}"
        </h4>
      ) : (
        <>
          <div className={styles.listBox}>
            {teacherList.slice(0, numToShow)}
          </div>
          {showPopup && (
            <DeleteTeacherConfirmation
              open={showPopup}
              onClose={() => {
                setShowPopup(!showPopup);
              }}
              popupName={popupName ? popupName : 'undefined'}
              popupEmail={popupEmail ? popupEmail : 'undefined'}
              removeTeacherId={removeTeacherId ? removeTeacherId : 'undefined'}
              setReloadList={setReloadList}
              reloadList={reloadList}
              teachers={props.teachers}
              setTeachers={props.setTeachers}
              setOpenSuccess={props.setOpenSuccess}
              setOpenFailure={props.setOpenFailure}
            />
          )}
          {numToShow < props.teachers.length && (
            <button className={styles.loadMore} onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      )}
    </>
  );
};

export default TeacherList;
