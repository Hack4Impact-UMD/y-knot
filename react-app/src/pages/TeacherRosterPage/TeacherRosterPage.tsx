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
import RemoveTeacherConfirmation from './RemoveTeacher/RemoveTeacherConfirmation/RemoveTeacherConfirmation';

const TeacherRosterPage = (): JSX.Element => {
    const [showPopup, setShowPopup] = useState(true);
    const [popupName, setPopUpName] = useState("John");
    const [popupEmail, setPopUpEmail] = useState("John@gmail.com");
    const setReloadList = () => 1 ;


    return (
        showPopup ? 
        (            <AddTeacher
            open={true}
            onClose = {()=> {
                setShowPopup(!showPopup);
            }}
            />)
        // (<RemoveTeacherConfirmation
        //     onClose = {() => {
        //         setShowPopup(!showPopup);
        //       }}
        //     popupName={popupName}
        //     popupEmail={popupEmail}
        //     removeTeacherId={"1"}
        //     setReloadList={setReloadList}
        //     open={true}
        // />)
        : (
            <RemoveTeacher
                open={true}
                onClose = {()=> {
                    setShowPopup(!showPopup);
                }}
                />
        )
    )
};

export default TeacherRosterPage;