import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WestRounded from '@mui/icons-material/WestRounded';
import { Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import editIcon from '../../assets/gray-pencil.svg';
import saveIcon from '../../assets/save.svg';
import { useAuth } from '../../auth/AuthProvider';
import {
  acceptLeadershipApplication,
  pendingLeadershipApplication,
  rejectLeadershipApplication,
  updateAcademyNote,
} from '../../backend/FirestoreCalls';
import Loading from '../../components/LoadingScreen/Loading';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { ToolTip } from '../../components/ToolTip/ToolTip';
import { LeadershipApplicant } from '../../types/StudentType';
import styles from './LeadershipApplicationPage.module.css';

function LeadershipApplicationPage() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowSize();
  const [text, setText] = useState<string>('');
  const [editText, setEditText] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [applicant, setApplicant] = useState<{
    applicantInfo: LeadershipApplicant;
    idx: number;
  }>();
  const [totalApplicants, setTotalApplicants] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const courseID = useParams().courseId;
  const appID = useParams().appId;

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.applicant) {
      setApplicant(location.state.applicant);
      setText(location.state.applicant?.applicantInfo.statusNote!);
    } else {
      if (
        location.state?.applicantList &&
        location.state?.applicantList.length > 0
      ) {
        const rightApplicant = location.state.applicantList.find(
          (applicant: { applicantInfo: LeadershipApplicant; idx: number }) =>
            applicant.idx == Number(appID),
        );
        setApplicant(rightApplicant);
        setText(rightApplicant?.applicantInfo.statusNote!);
      } else {
        navigate('../../');
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

  const handleEdit = async () => {
    if (editText) {
      if (text !== null && text !== undefined) {
        await updateAcademyNote(text, applicant?.applicantInfo.firebaseID!)
          .then(() => {
            const applicantReplacement = location.state.applicant;
            const applicantList = location.state.applicantList;
            const applicantId = location.state.applicationId;
            for (let i = 0; i < applicantList.length; i++) {
              if (applicantList[i].idx == applicant?.idx) {
                applicantList[i].applicantInfo.statusNote = text;
                break;
              }
            }
            navigate(location.pathname, {
              state: {
                applicant: applicantReplacement,
                applicantList: applicantList,
                applicantId: applicantId,
              },
            });
          })
          .catch((error) => {});
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
                {applicant?.applicantInfo.firstName}{' '}
                {applicant?.applicantInfo.middleName
                  ? applicant?.applicantInfo.middleName + ' '
                  : ''}{' '}
                {applicant?.applicantInfo.lastName}
              </h2>
              <div className={styles.statusLabel}>
                Application Status:{' '}
                <span
                  style={
                    applicant?.applicantInfo.status == 'ACCEPTED'
                      ? { color: 'var(--color-green)' }
                      : applicant?.applicantInfo.status == 'PENDING'
                      ? { color: 'var(--color-yellow-orange)' }
                      : applicant?.applicantInfo.status == 'REJECTED'
                      ? { color: 'var(--color-red)' }
                      : { color: '#9b9b9b' }
                  }
                >
                  {applicant?.applicantInfo.status == 'NA'
                    ? 'N/A'
                    : applicant?.applicantInfo
                    ? applicant?.applicantInfo.status.charAt(0).toUpperCase() +
                      applicant?.applicantInfo.status.slice(1).toLowerCase()
                    : ''}
                </span>
              </div>
              <div className={styles.statusContainer}>
                <button
                  className={`${styles.statusButton} ${styles.acceptButton}`}
                  onClick={() => {
                    setLoading(true);
                    acceptLeadershipApplication(applicant?.applicantInfo!)
                      .then(() => {
                        navigate(location.pathname.split('applicant')[0]);
                      })
                      .catch((error) => {
                        window.location.reload();
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  {loading ? <Loading /> : 'Accept'}
                </button>

                <button
                  className={`${styles.statusButton} ${styles.pendingButton}`}
                  onClick={() => {
                    setLoading(true);
                    pendingLeadershipApplication(
                      applicant?.applicantInfo.firebaseID!,
                    )
                      .then(() => {
                        navigate(location.pathname.split('applicant')[0]);
                      })
                      .catch((error) => {
                        window.location.reload();
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  {loading ? <Loading /> : 'Pending'}
                </button>

                <button
                  className={`${styles.statusButton} ${styles.rejectButton}`}
                  onClick={() => {
                    setLoading(true);
                    rejectLeadershipApplication(applicant?.applicantInfo!)
                      .then(() => {
                        navigate(location.pathname.split('applicant')[0]);
                      })
                      .catch((error) => {
                        window.location.reload();
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  {loading ? <Loading /> : 'Reject'}
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
                <input
                  className={`${styles.introText} ${
                    editText && styles.editing
                  }`}
                  disabled={!editText}
                  onChange={(event) => {
                    setText(event.target.value);
                  }}
                  value={text}
                ></input>
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
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.gender}
                      </div>
                    </div>

                    <div className={styles.box} id="Phone">
                      <div className={styles.boxTitle}>Phone</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.phone}
                      </div>
                    </div>

                    <div className={styles.box} id="Email">
                      <div className={styles.boxTitle}>Email</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.email}
                      </div>
                    </div>

                    <div className={styles.bottomBox} id="Address">
                      <div className={styles.boxTitle}>Address</div>
                      <div className={styles.boxData}>
                        <div>
                          {applicant?.applicantInfo.addrFirstLine},{' '}
                          {applicant?.applicantInfo.addrSecondLine
                            ? `${applicant?.applicantInfo.addrSecondLine}, `
                            : ''}
                          {applicant?.applicantInfo.city},{' '}
                          {applicant?.applicantInfo.state}{' '}
                          {applicant?.applicantInfo.zipCode}
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
                        {applicant?.applicantInfo.schoolName ?? ''}
                      </div>
                    </div>

                    <div className={styles.box} id="Grade Level">
                      <div className={styles.boxTitle}>Grade Level</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.gradeLevel ?? ''}
                      </div>
                    </div>

                    <div className={styles.box} id="GPA">
                      <div className={styles.boxTitle}>GPA</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.gpa}
                      </div>
                    </div>

                    <div
                      className={`${styles.bottomBox} ${styles.fileBox}`}
                      id="Transcript"
                    >
                      <div className={styles.boxTitle}>Transcript</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.transcriptFiles.map(
                          (transcript) => {
                            return (
                              <a
                                href={transcript.downloadURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileContainer}
                              >
                                <div className={styles.informationText}>
                                  {transcript.name}
                                </div>
                              </a>
                            );
                          },
                        )}
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
                        {applicant?.applicantInfo.guardianFirstName ?? ''}{' '}
                        {applicant?.applicantInfo.guardianLastName ?? ''}
                      </div>
                    </div>

                    <div className={styles.box} id="Guardian Email">
                      <div className={styles.boxTitle}>Email</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.guardianEmail ?? ''}
                      </div>
                    </div>

                    <div className={styles.bottomBox} id="Guardian Phone">
                      <div className={styles.boxTitle}>Phone</div>
                      <div className={styles.boxData}>
                        {applicant?.applicantInfo.guardianPhone ?? ''}
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
                          {applicant?.applicantInfo.involvement}
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
                          {applicant?.applicantInfo.whyJoin}
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
                          {applicant?.applicantInfo.recFiles.map((rec) => {
                            return (
                              <a
                                href={rec.downloadURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileContainer}
                              >
                                <div className={styles.informationText}>
                                  {rec.name}
                                </div>
                              </a>
                            );
                          })}
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
                {applicant?.idx != 1 ? (
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
                Applicant {applicant?.idx} of {totalApplicants}
              </p>

              <div className={styles.nextButtonContainer}>
                {applicant?.idx != totalApplicants ? (
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
