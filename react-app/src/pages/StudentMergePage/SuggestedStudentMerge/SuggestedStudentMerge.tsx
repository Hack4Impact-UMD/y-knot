import { StudentID } from '../../../types/StudentType';
import styles from './SuggestedStudentMerge.module.css';
import MergeStudentCard from './MergeStudentCard/MergeStudentCard';

const SuggestedStudentMerge = (): JSX.Element => {
  function createStudentPairs() {
    const studentPairs: Array<[StudentID, StudentID]> = [];
    for (let i = 1; i <= 5; i++) {
      const studentA: StudentID = {
        id: i.toString(),
        firstName: 'Fiona',
        lastName: 'Love',
        addrFirstLine: '7030 Jade Drive',
        city: '',
        state: '',
        zipCode: '',
        email: `fifi123@gmail.com`,
        phone: 0,
        guardianFirstName: '',
        guardianLastName: '',
        guardianEmail: '',
        guardianPhone: 0,
        birthDate: '',
        courseInformation: [],
      };

      const studentB: StudentID = {
        id: (i + 25).toString(),
        firstName: 'Fiona',
        lastName: 'Love',
        addrFirstLine: '7030 Jade Drive',
        city: '',
        state: '',
        zipCode: '',
        email: `fifi123@gmail.com`,
        phone: 0,
        guardianFirstName: '',
        guardianLastName: '',
        guardianEmail: '',
        guardianPhone: 0,
        birthDate: '',
        courseInformation: [],
      };

      studentPairs.push([studentA, studentB]);
    }
    return studentPairs;
  }

  const fakeStudentPairs = createStudentPairs();

  return (
    <div className={styles.container}>
      {fakeStudentPairs.map(([studentA, studentB], index) => (
        <div key={index} className={styles.cardContainer}>
          <MergeStudentCard studentA={studentA} studentB={studentB} />
        </div>
      ))}
    </div>
  );
};

export default SuggestedStudentMerge;
