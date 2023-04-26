import { StyleSheet, Font } from '@react-pdf/renderer';
import PoppinsTwo from '../../fonts/poppins/poppins-v20-latin-200.ttf';
import PoppinsThree from '../../fonts/poppins/poppins-v20-latin-300.ttf';
import PoppinsFive from '../../fonts/poppins/poppins-v20-latin-500.ttf';

Font.register({
  family: 'Poppins',
  fonts: [
    { src: PoppinsThree }, // font-weight: normal
    { src: PoppinsFive, fontWeight: 500 },
    { src: PoppinsTwo, fontWeight: 200 },
  ],
});

const styles = StyleSheet.create({
  boldHeader: {
    margin: '0 auto',
    fontSize: 10,
    padding: 10,
    fontFamily: 'Poppins',
    fontWeight: 500,
  },
  noMargin: {
    margin: 0,
  },
  page: {
    overflow: 'hidden',
  },
  section: { color: 'white', textAlign: 'center' },
  doc: {
    padding: 0,
    margin: 0,
  },
  table: {
    width: '80vw',
    borderCollapse: 'collapse',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  name: {
    textAlign: 'center',
    fontSize: '16px',
    fontFamily: 'Poppins',
    fontWeight: 500,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  activeCourses: {
    margin: 'auto',
    marginTop: '40px',
    flexDirection: 'row',
    borderTop: '2px solid #D8D8D8',
    borderBottom: '2px solid #D8D8D8',
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
    fontFamily: 'Poppins',
    fontWeight: 300,
  },
  coursesTableCell: {
    marginTop: 5,
    fontSize: 10,
    padding: '10px',
    fontFamily: 'Poppins',
    fontWeight: 300,
  },
  header: {
    textAlign: 'center',
    fontWeight: 'normal',
    paddingTop: '45px',
    paddingBottom: '20px',
    fontFamily: 'Poppins',
    fontWeight: 500,
  },
});

export default styles;
