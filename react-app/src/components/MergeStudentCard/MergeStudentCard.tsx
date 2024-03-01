import { useState, useEffect } from "react";
import { getStudent } from "../../backend/FirestoreCalls";
import { Student, StudentID } from "../../types/StudentType";
import styles from "./MergeStudentCard.module.css";
import trashIcon from "../../assets/trash.svg";

interface studentPair {
    studentIdA: StudentID;
    studentIdB: StudentID;
}

const MergeStudentCard = ({
    studentIdA,
    studentIdB
  }: studentPair): JSX.Element => {
    const [studentAData, setStudentAData] = useState<Student| null>(null);
    const [studentBData, setStudentBData] = useState<Student | null>(null);
  

    /* Fetch the student provided the id */
    useEffect(() => {
        const fetchStudentData = async () => {
            const dataA = await getStudent(studentIdA.id);
            const dataB = await getStudent(studentIdB.id);
            setStudentAData(dataA);
            setStudentBData(dataB);
        };

        fetchStudentData();
    }, [studentIdA.id, studentIdB.id]);

    /* Return a card that displays both the student names and info + merge button */
    return (
        <div className={styles.container}>
            <div className={styles.studentA}>
                <h1>Student A</h1>
            </div>
            <div className={styles.studentB}>
                <h1>Student B</h1>
            </div>
            <div className={styles.deleteSuggestionContainer}>
                <button className={styles.deleteSuggestionBtn}>
                    <img src={trashIcon} className={styles.trashIcon}/>
                    Delete Suggestion
                </button>
            </div>
            <div className={styles.mergeBtnContainer}>
                <button className={styles.mergeBtn}>Merge</button>
            </div>
            <div className={styles.studentAContainer}>
                <div className={styles.studentAName}>
                    <p>{studentIdA.firstName} {studentIdA.lastName}</p>
                </div>
                <div className={styles.studentAInfo}>
                    <p className={styles.studentInformationHeader}>Student Information</p>
                    <p>{studentIdA?.email || 'N/A'}</p>
                    <p>{studentIdA?.addrFirstLine || 'N/A'}</p>
                </div>
            </div>
            <div className={styles.studentBContainer}>
                <div className={styles.studentBName}>
                <p>{studentIdB?.firstName} {studentIdB?.lastName}</p>
                </div>
                <div className={styles.studentBInfo}>
                    <p className={styles.studentInformationHeader}>Student Information</p>
                    <p>{studentIdB?.email || 'N/A'}</p>
                    <p>{studentIdB?.addrFirstLine || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}

  export default MergeStudentCard;