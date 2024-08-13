import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  TbCaretDownFilled,
  TbCaretUpDownFilled,
  TbCaretUpFilled,
} from 'react-icons/tb';
import { useNavigate } from 'react-router';
import accept from '../../../assets/accept.png';
import noStatus from '../../../assets/noStatus.png';
import pending from '../../../assets/pending.png';
import reject from '../../../assets/reject.png';
import { getAcademyApplications } from '../../../backend/FirestoreCalls';
import Loading from '../../../components/LoadingScreen/Loading';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import { LeadershipApplicant } from '../../../types/StudentType';
import styles from './ClassAcademy.module.css';

const ClassAcademy = (props: { courseID: string }): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [applicantList, setApplicantList] = useState<
    {
      applicantInfo: LeadershipApplicant;
      idx: number;
    }[]
  >([]);
  useEffect(() => {
    setLoading(true);
    const runSetup = async () => {
      await getAcademyApplications(props.courseID)
        .then(async (applicants) => {
          const idApplicants: {
            applicantInfo: LeadershipApplicant;
            idx: number;
          }[] = [];
          const storage = getStorage();
          for (let i = 0; i < (applicants?.length || 0); i++) {
            const currentApplicant = applicants[i];

            // Get download urls for the files
            for (
              let j = 0;
              j < (currentApplicant['transcriptFiles']?.length || 0);
              j++
            ) {
              const pathReference = ref(
                storage,
                currentApplicant['transcriptFiles'][j]['ref'],
              );
              const downloadURL = await getDownloadURL(pathReference)
                .then((url) => {
                  return url;
                })
                .catch((error) => {
                  console.log(currentApplicant['transcriptFiles'][j]['ref']);
                  console.log(error);
                  throw new Error();
                });
              currentApplicant['transcriptFiles'][j]['downloadURL'] =
                downloadURL;
            }

            for (
              let j = 0;
              j < (currentApplicant['recFiles']?.length || 0);
              j++
            ) {
              const pathReference = ref(
                storage,
                currentApplicant['recFiles'][j]['ref'],
              );
              const downloadURL = await getDownloadURL(pathReference)
                .then((url) => {
                  return url;
                })
                .catch((error) => {
                  console.log('error');
                  throw new Error();
                });
              currentApplicant['recFiles'][j]['downloadURL'] = downloadURL;
            }

            idApplicants.push({ applicantInfo: currentApplicant, idx: i + 1 });
          }
          setApplicantList(idApplicants);
        })
        .catch((error) => {})
        .finally(() => setLoading(false));
    };
    runSetup();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Name',
      minWidth: 150,
      valueGetter: (value, row) => {
        return `${row.applicantInfo.firstName || ''} ${
          row.applicantInfo.lastName || ''
        }`;
      },
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      valueGetter: (value, row) => {
        return row.applicantInfo.email;
      },
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      valueGetter: (value, row) => {
        return row.applicantInfo.gradeLevel;
      },
      minWidth: 60,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.75,
      renderCell: (params) => {
        return (
          <ToolTip title={params.row.applicantInfo.statusNote} placement="top">
            <div className={styles.statusContainer}>
              {params.row.applicantInfo.status === 'NA' && (
                <>
                  <div>No Status</div>{' '}
                  <img src={noStatus} alt="no status" height={20} />
                </>
              )}
              {params.row.applicantInfo.status === 'ACCEPTED' && (
                <>
                  <div>Accepted</div>
                  <img src={accept} alt="accepted" height={20} />
                </>
              )}
              {params.row.applicantInfo.status === 'PENDING' && (
                <>
                  <div>Pending</div>
                  <img src={pending} alt="pending" height={20} />
                </>
              )}
              {params.row.applicantInfo.status === 'REJECTED' && (
                <>
                  <div>Rejected</div>
                  <img src={reject} alt="rejected" height={20} />
                </>
              )}
            </div>
          </ToolTip>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {loading ? (
          <Loading />
        ) : (
          <DataGrid
            getRowId={(row) => row.idx}
            rows={applicantList}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            slots={{
              // custom sort icons
              columnSortedDescendingIcon: () => <TbCaretDownFilled />,
              columnSortedAscendingIcon: () => <TbCaretUpFilled />,
              columnUnsortedIcon: () => <TbCaretUpDownFilled />,
            }}
            sx={{
              borderRadius: '20px',
              borderColor: 'black',
              '.MuiDataGrid-container--top [role=row]': {
                borderRadius: '20px',
              },
              '.MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderColor: 'black',
              },
              '& .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-filler > div': {
                borderTop: '1px solid black',
              },
              '.MuiDataGrid-iconButtonContainer': {
                // Sort icons
                visibility: 'visible',
              },
              '.MuiDataGrid-sortIcon': {
                // Sort icons
                opacity: 'inherit !important',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'var(--color-yellow-orange)',
                textDecoration: 'underline',
                cursor: 'pointer',
              },
              '& .MuiDataGrid-row.Mui-selected': {
                backgroundColor: 'var(--color-orange)',
                '&:hover': {
                  backgroundColor: 'var(--color-orange)',
                },
              },
              '.MuiDataGrid-footerContainer': {
                borderColor: 'black',
              },
            }}
            pageSizeOptions={[10]}
            disableColumnResize={true}
            hideFooterSelectedRowCount={true}
            disableColumnMenu={true}
            onRowClick={(row) =>
              navigate(`/courses/${props.courseID}/applicant/${row.row.idx}`, {
                state: {
                  applicant: row.row,
                  applicantList: applicantList,
                  applicantId: row.row.idx,
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default ClassAcademy;
