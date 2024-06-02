import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { TbCaretUpDownFilled } from 'react-icons/tb';
import { TbCaretUpFilled } from 'react-icons/tb';
import { TbCaretDownFilled } from 'react-icons/tb';
import styles from './ClassAcademy.module.css';
import accept from '../../../assets/accept.png';
import pending from '../../../assets/pending.png';
import reject from '../../../assets/reject.png';
import noStatus from '../../../assets/noStatus.png';

interface TestType {
  id: number;
  lastName: string;
  firstName: string;
  age: number;
}

const ClassAcademy = (): JSX.Element => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
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
          <div className={styles.statusContainer}>
            {/* {params.row.status} */}
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
        );
      },
    },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row: TestType) =>
    //     `${row.firstName || ''} ${row.lastName || ''}`,
    // },
  ];

  const rows = [
    {
      id: 1,
      name: 'Snow Jon',
      email: 'abc@gmail.com',
      dateApplied: '05/01/2024',
      status: 'NA',
    },
    {
      id: 2,
      name: 'Lannister Cersei',
      email: 'abcasd@gmail.com',
      dateApplied: '05/01/2024',
      status: 'PENDING',
    },
    {
      id: 3,
      name: 'Lannister Jaime',
      email: 'abc@gmail.com',
      dateApplied: '05/01/2024',
      status: 'ACCEPTED',
    },
    {
      id: 4,
      name: 'Stark Arya',
      email: 'abc@gmail.com',
      dateApplied: '05/01/2024',
      status: 'NA',
    },
    {
      id: 5,
      name: 'Targaryen Daenerys',
      email: 'abcsdf@gmail.com',
      dateApplied: '05/01/2024',
      status: 'REJECTED',
    },
    {
      id: 6,
      name: 'Melisandre',
      email: 'abc@gmail.com',
      dateApplied: '05/01/2024',
      status: 'NA',
    },
    {
      id: 7,
      name: 'Clifford Ferrara',
      email: 'abcsdfds@gmail.com',
      dateApplied: '05/01/2024',
      status: 'NA',
    },
    {
      id: 8,
      name: 'Frances Rossini',
      email: 'rtyrty@gmail.com',
      dateApplied: '05/01/2024',
      status: 'NA',
    },
    {
      id: 9,
      name: 'Roxie Harvey',
      email: 'abc@gmail.com',
      dateApplied: '05/01/2024',
      status: 'NA',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: { sortModel: [{ field: 'id', sort: 'asc' }] },
          }}
          slots={{
            columnSortedDescendingIcon: () => <TbCaretDownFilled />,
            columnSortedAscendingIcon: () => <TbCaretUpFilled />,
            columnUnsortedIcon: () => <TbCaretUpDownFilled />,
          }}
          sx={{
            borderRadius: '20px',
            borderColor: 'black',
            '.MuiDataGrid-columnHeaderRow': {
              // TODO: Trying to set border radius of column header row; Currently does not work
              borderRadius: '20px',
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
          // onRowClick={() => navigate(...))}
          //   pageSizeOptions={[5, 10]}
        />
      </div>
    </div>
  );
};

export default ClassAcademy;
