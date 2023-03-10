import CourseCard from '../../components/CourseCard/CourseCard';

const CoursesPage = (): JSX.Element => {
  return (
    <div>
      courses
      <CourseCard teacher="bob" course="1" section="1" />
    </div>
  );
};

export default CoursesPage;
