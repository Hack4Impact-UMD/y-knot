import {
  Page,
  Document,
  Text,
  StyleSheet,
  Image,
  Font,
  View,
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

Font.register({
  family: 'Poppins',

  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf',
      fontWeight: 600,
    },

    {
      src: 'http://fonts.gstatic.com/s/poppins/v20/pxiDyp8kv8JHgFVrJJLmr19lEN2PQEhcqw.ttf',
      fontWeight: 600,
      fontStyle: 'italic',
    },
    {
      src: 'http://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf',
      fontWeight: 400,
    },
  ],
});

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
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
    position: 'absolute',
    height: 'auto',
    width: '40%',
    left: '30%',
    top: 20,
  },
  signature: {
    left: '30%',
    width: '40%',
    marginTop: -40,
    marginBottom: -55,
  },
  signatureText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '12px',
  },
  line: {
    left: '34%',
    width: '32%',
    height: 6,
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
    top: -15,
  },
  sigView: {
    top: 15,
  },
});

const Certificate = ({ name, course }: studentDetails): JSX.Element => {
  return (
    <Document>
      <Page style={styles.page} orientation="landscape">
        <Image style={styles.logo} src={yknot}></Image>

        <View style={styles.textView}>
          <Text style={styles.title}>Certificate of Completion</Text>
          <Text style={styles.text}>
            Y-KNOT is proud to award this certificate to
          </Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.text}>for completion of the course:</Text>
          <Text style={styles.course}>{course}</Text>
        </View>

        <Text style={styles.text}>Congratulations!</Text>

        <View style={styles.sigView}>
          <Image style={styles.signature} src={reginaSignature}></Image>
          <Image style={styles.line} src={horizontalLine}></Image>
          <Text style={styles.signatureText}>Regina Gibbons</Text>
          <Text style={styles.signatureText}>Founder</Text>
        </View>

        <Image style={styles.curve} src={blueCurve}></Image>
        <Image style={styles.curve} src={orangeCurve}></Image>
        <Image style={styles.curve} src={yellowCurve}></Image>
        <Image style={styles.curve} src={greenCurve}></Image>
      </Page>
    </Document>
  );
};

export default Certificate;
