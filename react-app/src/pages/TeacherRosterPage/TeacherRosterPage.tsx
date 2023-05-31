import { Student, type StudentID } from '../../types/StudentType';
import { useState, useEffect } from 'react';
import { getAllStudents, getStudent } from '../../backend/FirestoreCalls';
import { authenticateUser } from '../../backend/FirebaseCalls';
import { useAuth } from '../../auth/AuthProvider';
import styles from './StudentRosterPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import AddTeacherConfirmation from './AddTeacher/AddTeacherConfirmation/AddTeacherConfirmation';
import { getMaxListeners } from 'process';
import AddTeacher from './AddTeacher/AddTeacher';
import RemoveTeacher from './RemoveTeacher/RemoveTeacher';
import RemoveTeacherError from './RemoveTeacher/RemoveTeacherError/RemoveTeacherError'
import RemoveTeacherConfirmation from './RemoveTeacher/RemoveTeacherConfirmation/RemoveTeacherConfirmation';

const TeacherRosterPage = (): JSX.Element => {
    const [showPopup, setShowPopup] = useState(true);
    const [popupName, setPopUpName] = useState("John");
    const [popupEmail, setPopUpEmail] = useState("John@gmail.com");
    const [removeSubmitted, setRemoveSubmitted] = useState(false);
    const [removeSubmissionError, setRemoveSubmissionError] = useState(false);
    const [addSubmitted, setAddSubmitted] = useState(false);
    const setReloadList = () => 1 ;

    return (
        showPopup ? 
        (
            <>
                <AddTeacher
                open={!addSubmitted}
                onClose = {()=> {
                    setShowPopup(!showPopup);
                }}
                setPopUpName={setPopUpName}
                setPopUpEmail={setPopUpEmail}
                setAddSubmitted={setAddSubmitted}
                />
                <AddTeacherConfirmation
                    onClose={() => {
                        setAddSubmitted(!addSubmitted)
                        setShowPopup(!showPopup);
                    } }
                    popupName={popupName}
                    popupEmail={popupEmail}
                    addTeacherId={"1"}
                    setReloadList={setReloadList}
                    open={addSubmitted} />
            </>
        ) : (
            <>
                <RemoveTeacher
                    open={!removeSubmitted}
                    onClose={() => {
                        setShowPopup(!showPopup);
                    } }
                    setRemoveSubmitted={setRemoveSubmitted}
                    setPopUpName={setPopUpName}
                    setPopUpEmail={setPopUpEmail} />
                <RemoveTeacherConfirmation
                    onClose={() => {
                      console.log('removeSubmissionError during onClose: ', removeSubmissionError);
                        if (!removeSubmissionError){
                          setRemoveSubmitted(!removeSubmitted)
                          setShowPopup(!showPopup);
                        }
                    } }
                    popupName={popupName}
                    popupEmail={popupEmail}
                    removeTeacherId={"1"}
                    setReloadList={setReloadList}
                    setRemoveSubmissionError={setRemoveSubmissionError}
                    open={removeSubmitted} />
                <RemoveTeacherError
                  popupEmail={popupEmail}
                  onClose={() => {
                    setRemoveSubmissionError(!removeSubmissionError);
                  } }
                  open = {removeSubmissionError}
                />
            </>
        )
    )
};

export default TeacherRosterPage;