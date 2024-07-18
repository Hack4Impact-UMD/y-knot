import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  doc: {},
  logo: {
    width: '40%',
    marginTop: 20,
  },
  page: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginTop: 25,
    marginBottom: 30,
    fontWeight: 600,
    fontSize: 27,
    textAlign: 'center',
  },
  text: {
    fontWeight: 400,
    fontSize: 23,
  },
  name: {
    marginTop: 20,
    marginBottom: 25,
    textDecoration: 'underline',
    fontSize: 37,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  course: {
    fontWeight: 600,
    fontStyle: 'italic',
    fontSize: 27,
    marginTop: 10,
    marginBottom: 40,
  },
  signature: {
    height: 120,
    margin: '-40px 0',
  },
  signatureText: {
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
