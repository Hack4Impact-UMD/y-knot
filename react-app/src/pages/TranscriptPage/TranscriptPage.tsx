import styles from './TranscriptPage.module.css';

const TranscriptPage = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.header}>Y-KNOT Transcript</h2>
        <p>Student Name: Fiona Jones</p>
        <table>
          <col className={styles.courses} />
          <col className={styles.dates} />
          <col className={styles.grade} />
          <tr className={styles.divider}>
            <td>Active Courses:</td>
            <td>Date of Course:</td>
            <td>Pass/Fail</td>
          </tr>
          <tr>
            <td>Biology</td>
            <td>1/1/2023-3/3/2023</td>
            <td>IP</td>
          </tr>
          <tr>
            <td>Math</td>
            <td>1/1/2023-3/3/2023</td>
            <td>IP</td>
          </tr>
          <tr>
            <td>Sign Language</td>
            <td>1/1/2023-3/3/2023</td>
            <td>IP</td>
          </tr>
          <tr className={styles.divider}>
            <td>Past Courses:</td>
            <td>Date of Course:</td>
            <td>Pass/Fail</td>
          </tr>
          <tr>
            <td>Science</td>
            <td>1/1/2022-3/3/2022</td>
            <td>P</td>
          </tr>
          <tr>
            <td>UX</td>
            <td>1/1/2022-3/3/2022</td>
            <td>P</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default TranscriptPage;
