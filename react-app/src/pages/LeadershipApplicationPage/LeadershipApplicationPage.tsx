import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { LeadershipApplicant, LeadershipFile } from '../../types/StudentType';
import { Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import styles from './LeadershipApplicationPage.module.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loading from '../../components/LoadingScreen/Loading';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WestRounded from '@mui/icons-material/WestRounded';
import editIcon from '../../assets/gray-pencil.svg';
import saveIcon from '../../assets/save.svg';

function LeadershipApplicationPage() {
  const leadershipFile: LeadershipFile = {
    name: 'abcdefghijklmn.pdf',
    path: 'path',
    downloadURL: 'https://www.clickdimensions.com/links/TestPDFfile.pdf',
  };

  const sampleApplicant: LeadershipApplicant = {
    idx: 1,
    dateApplied: '01/01/2001',
    gpa: '0',
    gender: '',
    textAnswer1: 'ta2',
    textAnswer2: 'ta2',
    transcript: leadershipFile,
    recLetter: leadershipFile,
    status: 'NA',
    statusNote: 'statusNote',
    firstName: 'Joseph',
    middleName: 'Michael',
    lastName: 'Smith',
    addrFirstLine: '1234 Commons 9',
    city: 'College Park',
    state: 'MD',
    zipCode: '12345',
    email: 'abc@gmail.com',
    phone: 0,
    guardianFirstName: 'Jack',
    guardianLastName: 'Smith',
    guardianEmail: 'cool@gmail.com',
    guardianPhone: 0,
    birthDate: '2024-02-04',
    gradeLevel: '7',
    schoolName: 'Best School High',
    courseInformation: [],
  };

  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowSize();
  const noteContentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>('Nice applicant...');
  const [editText, setEditText] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [applicant, setApplicant] =
    useState<LeadershipApplicant>(sampleApplicant);
  const [totalApplicants, setTotalApplicants] = useState<number>(0);
  const courseID = useParams().courseId;
  const appID = useParams().appId;

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.applicant) {
      setApplicant(location.state.applicant);
    } else {
      if (
        location.state?.applicantList &&
        location.state?.applicantList.length > 0
      ) {
        setApplicant(
          location.state.applicantList.find(
            (applicant: LeadershipApplicant) => applicant.idx == Number(appID),
          ),
        );
      } else {
        //TODO: retrieve applicant from url?
      }
    }

    if (
      location.state?.applicantList &&
      location.state?.applicantList.length > 0
    ) {
      setTotalApplicants(location.state.applicantList.length);
    } else {
      //TODO: retrieve total applicants from url?
    }
  }, [appID]);

  const handleEdit = (): void => {
    if (editText && noteContentRef.current != null) {
      const newText = noteContentRef.current.innerHTML; // Stores the HTML to preserve formatting

      if (newText !== null && newText !== undefined) {
        setText(newText);
      }
    }
    setEditText(!editText);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid black`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary {...props} />
  ))(({ theme }) => ({
    '&.Mui-expanded': {
      backgroundColor: 'var(--color-orange)',
      color: 'white',
      borderBottom: `1px solid black`,
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      color: 'white',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
  }));

  function useWindowSize() {
    const [size, setSize] = useState(window.innerWidth);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

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
            <button
              className={styles.backButton}
              onClick={() => {
                navigate(`/courses/${courseID}`);
              }}
            >
              <WestRounded style={{ color: '#757575', marginRight: '10px' }} />
              Back
            </button>

            {/* Application Status Part */}
            <div className={styles.headerAppStatusDiv}>
              <h2 className={styles.name}>
                {applicant.firstName} {applicant.middleName}{' '}
                {applicant.lastName}
              </h2>
              <div className={styles.statusLabel}>
                Application Status:{' '}
                <span
                  style={
                    applicant.status == 'ACCEPTED'
                      ? { color: 'var(--color-green)' }
                      : applicant.status == 'PENDING'
                      ? { color: 'var(--color-yellow-orange)' }
                      : applicant.status == 'REJECTED'
                      ? { color: 'var(--color-red)' }
                      : { color: '#9b9b9b' }
                  }
                >
                  {applicant.status == 'NA'
                    ? 'N/A'
                    : applicant.status.charAt(0).toUpperCase() +
                      applicant.status.slice(1).toLowerCase()}
                </span>
              </div>
              <div className={styles.statusContainer}>
                <button
                  className={`${styles.statusButton} ${styles.acceptButton}`}
                >
                  Accept
                </button>
                <button
                  className={`${styles.statusButton} ${styles.pendingButton}`}
                >
                  Pending
                </button>
                <button
                  className={`${styles.statusButton} ${styles.rejectButton}`}
                >
                  Reject
                </button>
              </div>
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

            {/* Accordion */}
            <div className={styles.accordionContainer}>
              {/* Personal Information */}
              <Accordion
                square={true}
                expanded={expanded === 'personalInfo'}
                onChange={handleChange('personalInfo')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Personal Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={styles.infoBox}>
                    <div className={styles.box} id="Gender">
                      <div className={styles.boxTitle}>Gender</div>
                      <div className={styles.boxData}>{applicant?.gender}</div>
                    </div>

                    <div className={styles.box} id="Phone">
                      <div className={styles.boxTitle}>Phone</div>
                      <div className={styles.boxData}>{applicant?.phone}</div>
                    </div>

                    <div className={styles.box} id="Email">
                      <div className={styles.boxTitle}>Email</div>
                      <div className={styles.boxData}>{applicant?.email}</div>
                    </div>

                    <div className={styles.bottomBox} id="Address">
                      <div className={styles.boxTitle}>Address</div>
                      <div className={styles.boxData}>
                        <div>
                          {applicant?.addrFirstLine},{' '}
                          {applicant?.addrSecondLine
                            ? `${applicant?.addrSecondLine}, `
                            : ''}
                          {applicant?.city}, {applicant?.state}{' '}
                          {applicant?.zipCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Educational Information */}
              <Accordion
                square={true}
                expanded={expanded === 'educationInfo'}
                onChange={handleChange('educationInfo')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Educational Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={styles.infoBox}>
                    <div className={styles.box} id="SchoolName">
                      <div className={styles.boxTitle}>School Name</div>
                      <div className={styles.boxData}>
                        {applicant?.schoolName}
                      </div>
                    </div>

                    <div className={styles.box} id="Grade Level">
                      <div className={styles.boxTitle}>Grade Level</div>
                      <div className={styles.boxData}>
                        {applicant?.gradeLevel}
                      </div>
                    </div>

                    <div className={styles.box} id="GPA">
                      <div className={styles.boxTitle}>GPA</div>
                      <div className={styles.boxData}>{applicant?.gpa}</div>
                    </div>

                    <div
                      className={`${styles.bottomBox} ${styles.fileBox}`}
                      id="Transcript"
                    >
                      <div className={styles.boxTitle}>Transcript</div>
                      <div className={styles.boxData}>
                        <a
                          href={applicant.transcript.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileContainer}
                        >
                          <div className={styles.informationText}>
                            {applicant.transcript.name
                              .substring(
                                0,
                                applicant.transcript.name.length - 3,
                              )
                              .substring(0, 10)}
                            {applicant.transcript.name.length - 3 > 10
                              ? '...pdf'
                              : 'pdf'}
                            <AiOutlineFilePdf />
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Guardian Information */}
              <Accordion
                square={true}
                expanded={expanded === 'guardianInfo'}
                onChange={handleChange('guardianInfo')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Guardian Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={styles.infoBox}>
                    <div className={styles.box} id="Guardian Name">
                      <div className={styles.boxTitle}>Name</div>
                      <div className={styles.boxData}>
                        {applicant?.guardianFirstName}{' '}
                        {applicant?.guardianLastName}
                      </div>
                    </div>

                    <div className={styles.box} id="Guardian Email">
                      <div className={styles.boxTitle}>Email</div>
                      <div className={styles.boxData}>
                        {applicant?.guardianEmail}
                      </div>
                    </div>

                    <div className={styles.bottomBox} id="Guardian Phone">
                      <div className={styles.boxTitle}>Phone</div>
                      <div className={styles.boxData}>
                        {applicant?.guardianPhone}
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Supplementary Materials */}
              <Accordion
                square={true}
                expanded={expanded === 'suppMaterial'}
                onChange={handleChange('suppMaterial')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Supplementary Materials</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={styles.supplementalContainer}>
                    <div className={styles.infoBox}>
                      <div className={styles.box} id="AnswerA">
                        <div className={styles.boxTitle}>Short Answer A</div>
                      </div>
                      <div className={styles.answerBox}>
                        <div className={styles.answerTitle}>
                          Briefly list your involvement with your school and
                          community.
                        </div>
                        <div className={styles.answer}>
                          {applicant.textAnswer1}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoBox}>
                      <div className={styles.box} id="AnswerB">
                        <div className={styles.boxTitle}>Short Answer B</div>
                      </div>
                      <div className={styles.answerBox}>
                        <div className={styles.answerTitle}>
                          Why would you like to participate in TOPTE Leadership
                          Academy?
                        </div>
                        <div className={styles.answer}>
                          {applicant.textAnswer2}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoBox}>
                      <div
                        className={`${styles.bottomBox} ${styles.fileBox}`}
                        id="Letter of Rec"
                      >
                        <div className={styles.boxTitle}>
                          Letter of Recommendation
                        </div>
                        <div className={styles.boxData}>
                          <a
                            href={applicant.recLetter.downloadURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.fileContainer}
                          >
                            <div className={styles.informationText}>
                              {applicant.recLetter.name
                                .substring(
                                  0,
                                  applicant.recLetter.name.length - 3,
                                )
                                .substring(0, 10)}
                              {applicant.recLetter.name.length - 3 > 10
                                ? '...pdf'
                                : 'pdf'}
                              <AiOutlineFilePdf />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>

            {/* Bottom Part */}
            <div className={styles.bottomLevel}>
              <div className={styles.prevButtonContainer}>
                {applicant.idx != 1 ? (
                  <button
                    className={`${styles.bottomButton} ${styles.prevButton}`}
                    onClick={() =>
                      navigate(
                        `/courses/${courseID}/applicant/${Number(appID) - 1}`,
                        {
                          state: {
                            applicantList: location.state?.applicantList ?? [],
                          },
                        },
                      )
                    }
                  >
                    <ChevronLeftIcon /> {windowWidth > 450 ? 'Previous' : ''}
                  </button>
                ) : (
                  <></>
                )}
              </div>

              <p className={styles.appIndex}>
                Applicant {applicant.idx} of {totalApplicants}
              </p>

              <div className={styles.nextButtonContainer}>
                {applicant.idx != totalApplicants ? (
                  <button
                    className={`${styles.bottomButton} ${styles.nextButton}`}
                    onClick={() =>
                      navigate(
                        `/courses/${courseID}/applicant/${Number(appID) + 1}`,
                        {
                          state: {
                            applicantList: location.state?.applicantList ?? [],
                          },
                        },
                      )
                    }
                  >
                    {windowWidth > 450 ? 'Next' : ''}
                    <ChevronRightIcon />
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LeadershipApplicationPage;
