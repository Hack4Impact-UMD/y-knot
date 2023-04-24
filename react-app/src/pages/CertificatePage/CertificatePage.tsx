import { PDFViewer } from '@react-pdf/renderer';
import Certificate from './Certificate';
import styles from './CertificatePage.module.css';

interface studentDetails {
  name: string;
  course: string;
}

const CertificatePage = ({ name, course }: studentDetails): JSX.Element => {
  return (
    <div>
      <div className={styles.page}>
        <PDFViewer className={styles.certificate}>
          <Certificate name={name} course={course} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default CertificatePage;
