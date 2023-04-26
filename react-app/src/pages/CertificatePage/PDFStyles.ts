import { StyleSheet, Font } from '@react-pdf/renderer';
import PoppinsSix from '../../fonts/poppins/poppins-v20-latin-600.ttf';
import PoppinsSixFancy from '../../fonts/poppins/poppins-v20-latin-600italic.ttf';
import PoppinsFive from '../../fonts/poppins/poppins-v20-latin-500.ttf';
import InterFour from '../../fonts/inter/inter-400.ttf';

Font.register({
  family: 'Poppins',

  fonts: [
    {
      src: PoppinsSix,
      fontWeight: 600,
    },

    {
      src: PoppinsSixFancy,
      fontWeight: 600,
      fontStyle: 'italic',
    },
    {
      src: PoppinsFive,
      fontWeight: 400,
    },
  ],
});

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: InterFour,
      fontWeight: 400,
    },
  ],
});

const styles = StyleSheet.create({
  doc: {
    padding: 0,
    margin: 0,
  },
  logo: {
    width: '40%',
    marginTop: 30,
  },
  page: {
    fontFamily: 'Poppins',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginTop: 25,
    marginBottom: 20,
    fontWeight: 600,
    fontSize: 27,
    textAlign: 'center',
  },
  text: {
    fontWeight: 400,
    fontSize: 23,
  },
  name: {
    textDecoration: 'underline',
    fontSize: 37,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  course: {
    fontWeight: 600,
    fontStyle: 'italic',
    fontSize: 27,
    marginBottom: 20,
  },
  signature: {
    height: 120,
    margin: '-40px 0',
  },
  signatureText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 14,
    textAlign: 'center',
  },
  line: {
    width: 250,
    height: 6,
    marginTop: -13,
    marginBottom: 10,
  },
  curve: {
    position: 'absolute',
    zIndex: -10,
    width: '100%',
    height: 'auto',
    left: 0,
    bottom: 0,
  },
  textView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sigView: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
});

export default styles;
