import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import blueCurve from '../../assets/blue-curve.png';
import greenCurve from '../../assets/green-curve.png';
import horizontalLine from '../../assets/horizontal-line.png';
import orangeCurve from '../../assets/orange-curve.png';
import reginaSignature from '../../assets/regina-signature.png';
import yellowCurve from '../../assets/yellow-curve.png';
import yknot from '../../assets/yknot-logo.png';
import styles from './PDFStyles';

interface studentDetails {
  name: string;
  course: string;
}

const CertificatePage = ({ name, course }: studentDetails): JSX.Element => {
  return (
    <Document style={styles.doc}>
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

export default CertificatePage;
