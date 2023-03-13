import styles from './CourseCard.module.css';

interface courseDetails {
  teacher: string;
  course: string;
  section: string;
}

const CourseCard = (props: courseDetails): JSX.Element => {
  const labels = ['Teacher Name', 'Course', 'Section'];
  const description = Object.entries(props).map((elem, index) => (
    <div>
      {labels[index]}: {elem[1]}
    </div>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default CourseCard;
