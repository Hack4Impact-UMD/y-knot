import styles from './TranscriptPage.module.css';
import otherStyles from './PDFStyles';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';

const TranscriptPage = () => {
  return (
    // A container is used to get rid of a bug with iframes where there are 2 scrollbars
    <div className={styles.container}>
      <PDFViewer className={styles.viewer} width="100%" height="100%">
        <Document style={otherStyles.doc}>
          <Page size="A4" style={otherStyles.page}>
            <View style={[styles.container, styles.content]}>
              <Text style={otherStyles.header}>Y-KNOT Transcript</Text>
              <Text>Student Name: Fiona Jones</Text>
              <View style={[styles.divider, styles.table]}>
                <Text style={styles.courses}>Active Courses:</Text>
                <Text style={styles.dates}>Date of Course:</Text>
                <Text style={styles.grade}>Pass/Fail</Text>
              </View>
              {/* {data.map((item, index) => (
          <View style={styles.table}>
            <Text style={styles.td}>{item.course}</Text>
            <Text style={styles.td}>{item.date}</Text>
            <Text style={styles.td}>{item.grade}</Text>
          </View>
        ))} */}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

// const TranscriptPage = (): JSX.Element => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <h2 className={styles.header}>Y-KNOT Transcript</h2>
//         <p>Student Name: Fiona Jones</p>
//         <table>
//           <col className={styles.courses} />
//           <col className={styles.dates} />
//           <col className={styles.grade} />
//           <tr className={styles.divider}>
//             <td>Active Courses:</td>
//             <td>Date of Course:</td>
//             <td>Pass/Fail</td>
//           </tr>
//           <tr>
//             <td>Biology</td>
//             <td>1/1/2023-3/3/2023</td>
//             <td>IP</td>
//           </tr>
//           <tr>
//             <td>Math</td>
//             <td>1/1/2023-3/3/2023</td>
//             <td>IP</td>
//           </tr>
//           <tr>
//             <td>Sign Language</td>
//             <td>1/1/2023-3/3/2023</td>
//             <td>IP</td>
//           </tr>
//           <tr className={styles.divider}>
//             <td>Past Courses:</td>
//             <td>Date of Course:</td>
//             <td>Pass/Fail</td>
//           </tr>
//           <tr>
//             <td>Science</td>
//             <td>1/1/2022-3/3/2022</td>
//             <td>P</td>
//           </tr>
//           <tr>
//             <td>UX</td>
//             <td>1/1/2022-3/3/2022</td>
//             <td>P</td>
//           </tr>
//         </table>
//       </div>
//     </div>
//   );
// };

export default TranscriptPage;
