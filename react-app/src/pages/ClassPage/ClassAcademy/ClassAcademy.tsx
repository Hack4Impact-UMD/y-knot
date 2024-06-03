import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { TbCaretUpDownFilled } from 'react-icons/tb';
import { TbCaretUpFilled } from 'react-icons/tb';
import { TbCaretDownFilled } from 'react-icons/tb';
import {
  LeadershipApplicant,
  LeadershipFile,
} from '../../../types/StudentType';
import { ToolTip } from '../../../components/ToolTip/ToolTip';
import styles from './ClassAcademy.module.css';
import accept from '../../../assets/accept.png';
import pending from '../../../assets/pending.png';
import reject from '../../../assets/reject.png';
import noStatus from '../../../assets/noStatus.png';

const leadershipFile: LeadershipFile = {
  name: 'abc.pdf',
  path: 'path',
  downloadURL: 'https://www.clickdimensions.com/links/TestPDFfile.pdf',
};

const sampleApplicants: LeadershipApplicant[] = [
  {
    idx: 1,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
    textAnswer2: 'ta2',
    transcript: leadershipFile,
    recLetter: leadershipFile,
    status: 'ACCEPTED',
    statusNote: 'great applicant! Accepted!',
    firstName: 'Bob',
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
  },
  {
    idx: 2,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 3,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 4,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 6,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 5,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 7,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 8,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 9,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 10,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 11,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
  {
    idx: 12,
    dateApplied: '01/01/2001',
    gpa: '3.0',
    gender: 'M',
    textAnswer1: 'ta1',
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
  },
];

const ClassAcademy = (props: { courseID: string }): JSX.Element => {
  const navigate = useNavigate();
  const [applicantList, setApplicantList] =
    useState<LeadershipApplicant[]>(sampleApplicants);

  const columns: GridColDef[] = [
    { field: 'idx', headerName: 'ID', width: 70 },
    {
      field: 'fullName',
      headerName: 'Name',
      width: 200,
      valueGetter: (value, row) => {
        return `${row.firstName || ''} ${row.lastName || ''}`;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'dateApplied',
      headerName: 'Date Applied',
      width: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        return (
          <ToolTip title={params.row.statusNote} placement="top">
            <div className={styles.statusContainer}>
              {params.row.status === 'NA' && (
                <>
                  <div>No Status</div>{' '}
                  <img src={noStatus} alt="no status" height={20} />
                </>
              )}
              {params.row.status === 'ACCEPTED' && (
                <>
                  <div>Accepted</div>
                  <img src={accept} alt="accepted" height={20} />
                </>
              )}
              {params.row.status === 'PENDING' && (
                <>
                  <div>Pending</div>
                  <img src={pending} alt="pending" height={20} />
                </>
              )}
              {params.row.status === 'REJECTED' && (
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
        <DataGrid
          getRowId={(row) => row.idx}
          rows={applicantList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: { sortModel: [{ field: 'id', sort: 'asc' }] },
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
            navigate(`/courses/${props.courseID}/applicant/${row.id}`, {
              state: {
                applicant: row.row,
                applicantList: applicantList,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default ClassAcademy;
