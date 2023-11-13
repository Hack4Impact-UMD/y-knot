import { Page, Document, Text, Image, View } from '@react-pdf/renderer';
import styles from './PDFStyles';
import yknot from '../../assets/yknot-logo.png';
import reginaSignature from '../../assets/regina-signature.png';
import horizontalLine from '../../assets/horizontal-line.png';
import yellowCurve from '../../assets/yellow-curve.png';
import blueCurve from '../../assets/blue-curve.png';
import orangeCurve from '../../assets/orange-curve.png';
import greenCurve from '../../assets/green-curve.png';
import { type Student } from '../../types/StudentType';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CourseID } from '../../types/CourseType';
import {
  getStudent,
  updateStudent,
  getCourse,
} from '../../backend/FirestoreCalls';

interface studentDetails {
  name: string;
  course: string;
}
const blankStudent: Student = {
  firstName: '',
  middleName: '',
  lastName: '',
  addrFirstLine: '',
  city: '',
  state: '',
  zipCode: '',
  email: '',
  phone: 0,
  guardianFirstName: '',
  guardianLastName: '',
  guardianEmail: '',
  guardianPhone: 0,
  birthDate: '',
  gradeLevel: '',
  schoolName: '',
  courseInformation: [],
};
const [student, setStudent] = useState<Student>(blankStudent);
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
const authContext = useAuth();
const studentID = useParams().id;
const navigate = useNavigate();
const [courses, setCourses] = useState<CourseID[]>([]);
const [error, setError] = useState<boolean>(false);
const [pageError, setPageError] = useState<boolean>(false);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  if (studentID) {
    getStudent(studentID)
      .then(async (data) => {
        setStudent(data || blankStudent);
      })
      .catch(() => {
        setError(true);
        setPageError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, []);

const Certificate = ({ name, course }: studentDetails): JSX.Element => {
  return (
    <Document style={styles.doc}>
      <Page style={styles.page} orientation="landscape">
        <Image style={styles.logo} src={yknot}></Image>

        <View style={styles.textView}>
          <Text style={styles.title}>Certificate of Completion</Text>
          <Text style={styles.text}>
            Y-KNOT is proud to award this certificate to {student.firstName}
          </Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.text}>
            for completion of the course: {course}{' '}
          </Text>
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
