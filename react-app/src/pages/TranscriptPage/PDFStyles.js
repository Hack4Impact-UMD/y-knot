import { StyleSheet, Font } from '@react-pdf/renderer';
import Poppins from '../../fonts/poppins/poppins.css';

Font.register({ family: 'Poppins', src: Poppins });

const styles = StyleSheet.create({
  page: {
    overflow: 'hidden',
  },
  section: { color: 'white', textAlign: 'center' },
  doc: {
    padding: 0,
    margin: 0,
  },
  '*': {
    fontFamily: Poppins,
  },
  table: {
    width: '65vw',
    borderCollapse: 'collapse',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  name: {
    marginLeft: 0,
    marginRight: '40%',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  activeCourses: {
    margin: 'auto',
    flexDirection: 'row',
    borderTop: '3px solid var(--color-grey)',
    borderBottom: '3px solid var(--color-grey)',
  },
  coursesTableCol: {
    width: '50%',
    marginLeft: 0,
  },
  tableCol: {
    width: '25%',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
    padding: '10px',
  },
  coursesTableCell: {
    marginTop: 5,
    fontSize: 10,
    padding: '10px',
  },
  header: {
    textAlign: 'center',
    fontWeight: 'normal',
    paddingTop: '45px',
    paddingBottom: '20px',
  },
});

export default styles;
