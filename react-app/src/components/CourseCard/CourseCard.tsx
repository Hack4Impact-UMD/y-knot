import { useEffect, useState } from 'react';
import { useAuth } from '../../../src/auth/AuthProvider';
import styles from './CourseCard.module.css';
import { DateTime } from 'luxon';
import { getTeacher } from '../../backend/FirestoreCalls';
import type { Teacher } from '../../types/UserType';

const dateFormat = 'LLL dd, yyyy';

interface courseDetails {
  teacher: string[];
  course: string;
  color?: string;
  startDate: string;
  endDate: string;
}

const CourseCard = ({
  teacher,
  course,
  startDate,
  endDate,
  color,
}: courseDetails): JSX.Element => {
  const [teacherInformation, setTeacherInformation] =
    useState<Array<Teacher>>();
  const authContext = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const teacherInfo = await Promise.all(
        teacher.map(async (teach) => {
          return await getTeacher(teach);
        }),
      ).catch(() => {
        console.log('Error getting teacher information in course card');
      });
      setTeacherInformation(teacherInfo!);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{
          backgroundColor: color || 'var(--color-orange)',
        }}
      >
        <div className={styles.course}>{course}</div>
        <div className={styles.section}>{`${DateTime.fromISO(
          startDate,
        ).toFormat(dateFormat)} - ${DateTime.fromISO(endDate).toFormat(
          dateFormat,
        )}`}</div>
      </div>
      <div className={styles.description}>
        {authContext?.token?.claims.role === 'ADMIN'
          ? teacherInformation?.map((teacher, i) => {
              if (i == 0) return teacher.name;
              else return `, ${teacher.name}`;
            })
          : ''}
      </div>
    </div>
  );
};

export default CourseCard;
