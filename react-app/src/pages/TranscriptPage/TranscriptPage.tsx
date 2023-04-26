import otherStyles from './TranscriptPage.module.css';
import styles from './PDFStyles';
import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';

const TranscriptPage = (): JSX.Element => {
  const activeCourses = [
    { course: 'Biology', date: '1/1/2023-3/3/2023', grade: 'IP' },
    { course: 'Math', date: '1/1/2023-3/3/2023', grade: 'IP' },
    { course: 'Sign Language', date: '1/1/2023-3/3/2023', grade: 'IP' },
  ];
  const upcomingCourses = [
    { course: 'History', date: '3/4/2023-6/3/2023', grade: 'N/A' },
    { course: 'Spanish', date: '3/4/2023-6/3/2023', grade: 'N/A' },
  ];
  const pastCourses = [
    { course: 'Science', date: '1/1/2022-3/3/2022', grade: 'P' },
    { course: 'UX', date: '1/1/2022-3/3/2022', grade: 'P' },
  ];
  return (
    // A container is used to get rid of a bug with iframes where there are 2 scrollbars
    <div className={otherStyles.container}>
      <PDFViewer width="100%" height="100%">
        <Document style={styles.doc}>
          <Page size="A4" style={styles.page}>
            <View style={styles.table}>
              <Text style={styles.header}>Y-KNOT Transcript</Text>
              <Text style={styles.name}>Fiona Jones</Text>
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
