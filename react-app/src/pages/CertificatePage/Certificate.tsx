import {
  Page,
  Document,
  Text,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

import yknot from '../../assets/yknot-logo.png';
import reginaSignature from '../../assets/regina-signature.png';
import horizontalLine from '../../assets/horizontal-line.png';
import yellowCurve from '../../assets/yellow-curve.png';
import blueCurve from '../../assets/blue-curve.png';
import orangeCurve from '../../assets/orange-curve.png';
import greenCurve from '../../assets/green-curve.png';

interface studentDetails {
  name: string;
  course: string;
}

import Poppins600 from '../../fonts/poppins/poppins-v20-latin-600.tff';
import Poppins600Italic from '../../fonts/poppins/poppins-v20-latin-600italic.tff';
import Poppins500 from '../../fonts/poppins/poppins-v20-latin-500.tff';

Font.register({
  family: 'Poppins',

  fonts: [
    {
      src: Poppins600Italic,
      fontWeight: 600,
    },

    {
      src: '../../fonts/poppins/poppins-v20-latin-600.tff',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    {
      src: '../../fonts/poppins/poppins-v20-latin-600.tff',
      fontWeight: 400,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  title: {
    fontWeight: 600,
    fontSize: 35,
  },
  text: {
    fontWeight: 400,
    fontSize: 25,
  },
  name: {
    textDecoration: 'underline',
    fontSize: 50,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  course: {
    fontWeight: 600,
    fontStyle: 'italic',
    fontSize: 25,
  },
  logo: {
    height: 'auto',
    width: '40%',
    left: '30%',
    top: '-10%',
  },

  signature: {
    left: '30%',
    width: '40%',
    marginBottom: -40,
  },
  line: {
    left: '34%',
    width: '32%',
    height: '1%',
  },
  curve: {
    position: 'absolute',
    zIndex: -10,
    width: '100%',
    height: 'auto',
    left: 0,
    bottom: 0,
  },
});

const Certificate = ({ name, course }: studentDetails): JSX.Element => {
  return (
    <Document>
      <Page style={styles.page} orientation="landscape">
        <Image style={styles.logo} src={yknot}></Image>

        <Text style={styles.title}>Certificate of Completion</Text>
        <Text style={styles.text}>
          Y-KNOT is proud to award this certificate to
        </Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.text}>for completion of the course:</Text>
        <Text style={styles.course}>{course}</Text>
        <Text style={styles.text}>Congratulations!</Text>

        <Image style={styles.signature} src={reginaSignature}></Image>
        <Image style={styles.line} src={horizontalLine}></Image>
        <Text>Regina Gibbons</Text>
        <Text>Founder</Text>

        <Image style={styles.curve} src={blueCurve}></Image>
        <Image style={styles.curve} src={orangeCurve}></Image>
        <Image style={styles.curve} src={yellowCurve}></Image>
        <Image style={styles.curve} src={greenCurve}></Image>
      </Page>
    </Document>
  );
};

export default Certificate;
