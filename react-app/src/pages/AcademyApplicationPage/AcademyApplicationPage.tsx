import React, { useRef, useState } from 'react';
import { LeadershipApplicant, LeadershipFile } from '../../types/StudentType';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import styles from './AcademyApplicationPage.module.css';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/LoadingScreen/Loading';
import { IntroEmailFile } from '../../types/CourseType';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import editIcon from '../../assets/gray-pencil.svg';
import saveIcon from '../../assets/save.svg';

interface ApplicantList {
  applicants: LeadershipApplicant[];
}
// function AcademyApplicationPage({ applicants }: ApplicantList) {
function AcademyApplicationPage() {
  //   const {
  //     firstName,
  //     middleName,
  //     lastName,
  //     status,
  //     statusNote,
  //     textAnswer1,
  //     textAnswer2,
  //     idx,
  //   } = applicants[0];
  const leadershipFile: LeadershipFile = {
    name: 'name',
    path: 'path',
    downloadURL: 'url',
  };
  const applicant: LeadershipApplicant = {
    idx: 0,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
    textAnswer2: 'ta2',
    transcript: leadershipFile,
    recLetter: leadershipFile,
    status: 'NA',
    statusNote: 'statusNote',
    firstName: '',
    middleName: '',
    lastName: '',
    addrFirstLine: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: 0,
    guardianFirstName: '',
    guardianLastName: '',
    guardianEmail: '',
    guardianPhone: 0,
    birthDate: '',
    gradeLevel: '',
    schoolName: '',
    courseInformation: [],
  };
  const totalApplicants = 10;
  const authContext = useAuth();

  const emailContentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>(
    'Hello everyone and welcome to math! In this course we will be teaching...',
  );
  const [editText, setEditText] = useState<boolean>(false);

  const handleEdit = (): void => {
    if (editText && emailContentRef.current != null) {
      const newText = emailContentRef.current.innerHTML; // Stores the HTML to preserve formatting

      if (newText !== null && newText !== undefined) {
        setText(newText);
      }
    }
    setEditText(!editText);
  };
  const accordionStyle = {
    border: '1px solid black', // Set the border color to black
  };
  return (
    <div>
      {authContext?.loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <div className={styles.rightPane}>
            {/* Top Part  */}
            <div>
              <button
                className={styles.backButton}
                onClick={() => {
                  /* Handle back button click */
                }}
              >
                Back
              </button>
            </div>

            {/* Application Status Part */}
            <div className={styles.headerAppStatusDiv}>
              <h3>Name</h3>
              <div>Application Status</div>
              <button>Accept</button>
              <button>Pending</button>
              <button>Reject</button>
            </div>

            {/* Notes Area */}
            <div className={styles.introCard}>
              <div className={styles.introHeader}>
                <div className={styles.introButtons}>
                  {editText}
                  <ToolTip title={editText ? 'Save' : 'Edit'} placement="top">
                    <button className={styles.editButton} onClick={handleEdit}>
                      {editText ? (
                        <img
                          src={saveIcon}
                          alt="Save Text"
                          className={styles.icon}
                        />
                      ) : (
                        <img
                          src={editIcon}
                          alt="Edit Text"
                          className={styles.icon}
                        />
                      )}
                    </button>
                  </ToolTip>
                </div>
              </div>
              <div className={styles.introContent}>
                <div
                  className={`${styles.introText} ${
                    editText && styles.editing
                  }`}
                  contentEditable={editText}
                  dangerouslySetInnerHTML={{ __html: text }}
                ></div>
              </div>
            </div>
            {/* Include a component for the notes section (you can reuse ClassIntro component) */}
            {/* Accordion */}

            <div className={styles.accordionContainer}>
              <Accordion square={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>Expanded by default</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion square={true} style={{ border: '1px solid black' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography>Header</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>

            {/* Repeat Accordion for other sections */}

            {/* Bottom Part */}
            <div>
              <Button>Previous Applicant</Button>
              <Typography>{`Applicant ${applicant.idx} of ${totalApplicants}`}</Typography>
              <Button>Next Applicant</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AcademyApplicationPage;
