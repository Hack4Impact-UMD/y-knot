import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import styles from './MergeSelectionPage.module.css';
import WestRounded from '@mui/icons-material/WestRounded';
import ManualStudentMerge from './ManualStudentMerge/ManualStudentMerge';
import SuggestedStudentMerge from './SuggestedStudentMerge/SuggestedStudentMerge';

enum Tab {
  Suggested = 'Suggested',
  Manual = 'Manual',
}

const MergeSelectionPage = ({
  studentMerged,
  setStudentMerged,
}: any): JSX.Element => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Suggested);

  const handleTabChange = (tab: Tab): void => {
    setCurrentTab(tab);
  };

  return (
    <>
      <NavigationBar />
      <div className={styles.rightPane}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => {
              navigate('/students');
            }}
          >
            <WestRounded style={{ color: '#757575', marginRight: '10px' }} />
            Back
          </button>
        </div>
        <div className={styles.top}>
          <h1 className={styles.title}>Merge Students</h1>
          <div className={styles.buttons}>
            <button
              className={
                currentTab === Tab.Suggested ? styles.selectedTab : styles.tab
              }
              onClick={() => {
                handleTabChange(Tab.Suggested);
              }}
            >
              Suggested
            </button>
            <button
              className={
                currentTab === Tab.Manual ? styles.selectedTab : styles.tab
              }
              onClick={() => {
                handleTabChange(Tab.Manual);
              }}
            >
              Manual
            </button>
          </div>
        </div>
        {currentTab === Tab.Suggested && <SuggestedStudentMerge />}
        {currentTab === Tab.Manual && <ManualStudentMerge />}
      </div>
      <Snackbar
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        open={studentMerged}
        autoHideDuration={3000}
        onClose={() => setStudentMerged(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Student was Successfully Merged
        </Alert>
      </Snackbar>
    </>
  );
};

export default MergeSelectionPage;
