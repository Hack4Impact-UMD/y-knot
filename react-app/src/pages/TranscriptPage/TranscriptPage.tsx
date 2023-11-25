import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
import styles from './PDFStyles';
import otherStyles from './TranscriptPage.module.css';
import { getCourse, getStudent } from '../../backend/FirestoreCalls';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { type Student } from '../../types/StudentType';
import { type Course } from '../../types/CourseType';
import { DateTime } from 'luxon';

const TranscriptPage = (): JSX.Element => {
  interface CourseTranscript {
    course: string;
    date: string;
    grade: string;
  }

  const [activeCourses, setActiveCourses] = useState<CourseTranscript[]>([]);
  const [upcomingCourses, setUpcomingCourses] = useState<CourseTranscript[]>(
    [],
  );
  const [pastCourses, setPastCourses] = useState<CourseTranscript[]>([]);
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
  const studentId = useParams().id;

  useEffect(() => {
    if (studentId) {
      const upcomingCoursesTemp: CourseTranscript[] = [];
      const activeCoursesTemp: CourseTranscript[] = [];
      const pastCoursesTemp: CourseTranscript[] = [];
      const getTranscriptDate = (course: Course) => {
        const startDate = DateTime.fromISO(course.startDate);
        const endDate = DateTime.fromISO(course.endDate);

        const formattedStartDate = startDate.toFormat('MM/dd/yyyy');
        const formattedEndDate = endDate.toFormat('MM/dd/yyyy');
        const transcriptDate = `${formattedStartDate}-${formattedEndDate}`;
        return transcriptDate;
      };

      getStudent(studentId).then(async (studentData) => {
        setStudent(studentData || blankStudent);
        if (studentData.courseInformation) {
          await Promise.all(
            studentData.courseInformation.map(async (studentCourseObj) => {
              const courseObj = await getCourse(studentCourseObj.id);
              const transcriptObject = { course: '', date: '', grade: '' };
              transcriptObject.date = getTranscriptDate(courseObj);
              transcriptObject.course = courseObj.name;
              if (studentCourseObj.progress === 'NA') {
                transcriptObject.grade = 'N/A';
                upcomingCoursesTemp.push(transcriptObject);
              } else if (studentCourseObj.progress === 'INPROGRESS') {
                transcriptObject.grade = 'IP';
                activeCoursesTemp.push(transcriptObject);
              } else {
                transcriptObject.grade = studentCourseObj.progress.charAt(0);
                pastCoursesTemp.push(transcriptObject);
              }
            }),
          );

          setUpcomingCourses(upcomingCoursesTemp);
          setActiveCourses(activeCoursesTemp);
          setPastCourses(pastCoursesTemp);
        }
      });
    }
  }, []);

  return (
    // A container is used to get rid of a bug with iframes where there are 2 scrollbars
    <div className={otherStyles.container}>
      <PDFViewer width="100%" height="100%">
        <Document style={styles.doc}>
          <Page size="A4" style={styles.page}>
            <View style={styles.table}>
              <Text style={styles.header}>Y-KNOT Transcript</Text>
              <Text style={styles.name}>
                {student.firstName} {student.lastName}
              </Text>
              <View style={styles.activeCourses}>
                <View style={styles.coursesTableCol}>
                  <Text style={[styles.boldHeader, styles.noMargin]}>
                    Active Courses:
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.boldHeader}>Date of Course:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.boldHeader}>Pass/Fail</Text>
                </View>
              </View>
              {activeCourses.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.coursesTableCol}>
                    <Text style={styles.coursesTableCell}>{item.course}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.date}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.grade}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.activeCourses}>
                <View style={styles.coursesTableCol}>
                  <Text style={[styles.boldHeader, styles.noMargin]}>
                    Upcoming Courses:
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.boldHeader}>Date of Course:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.boldHeader}>Pass/Fail</Text>
                </View>
              </View>
              {upcomingCourses.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.coursesTableCol}>
                    <Text style={styles.coursesTableCell}>{item.course}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.date}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.grade}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.activeCourses}>
                <View style={styles.coursesTableCol}>
                  <Text style={[styles.boldHeader, styles.noMargin]}>
                    Past Courses:
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.boldHeader}>Date of Course:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.boldHeader}>Pass/Fail</Text>
                </View>
              </View>
              {pastCourses.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.coursesTableCol}>
                    <Text style={styles.coursesTableCell}>{item.course}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.date}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.grade}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default TranscriptPage;
