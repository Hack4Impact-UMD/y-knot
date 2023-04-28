import { PDFViewer } from '@react-pdf/renderer';
import styles from './CertificatePage.module.css';
import Certificate from './Certificate';

interface studentDetails {
  name: string;
  course: string;
}

const CertificatePage = ({ name, course }: studentDetails): JSX.Element => {
  return (
    <div>
      <div className={styles.page}>
        <PDFViewer width="100%" height="100%">
          <Certificate name={name} course={course} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default CertificatePage;
