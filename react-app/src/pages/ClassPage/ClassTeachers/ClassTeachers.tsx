import styles from './ClassTeachers.module.css';
import trashIcon from '../../../assets/trash.svg';
import eyeIcon from '../../../assets/view.svg';
const ClassTeachers = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.inputs}>
        <div className={styles.box} id="Name">
          <a className={styles.boxTitle}>Fiona Love</a>
          <div className={styles.icons}>
            <img
              src={eyeIcon}
              className={`${styles.eyeIcon} eyeIcon`}
              id="icon"
            ></img>
            <img src={trashIcon} className="trashIcon" id="icon"></img>
          </div>
        </div>
        <div className={styles.box} id="Name">
          <a className={styles.boxTitle}>Alicia Jacobs</a>
          <div className={styles.icons}>
            <img
              src={eyeIcon}
              className={`${styles.eyeIcon} eyeIcon`}
              id="icon"
            ></img>
            <img src={trashIcon} className="trashIcon" id="icon"></img>
          </div>
        </div>
        <div className={styles.box} id="Name">
          <a className={styles.boxTitle}>Emily Lee</a>
          <div className={styles.icons}>
            <img
              src={eyeIcon}
              className={`${styles.eyeIcon} eyeIcon`}
              id="icon"
            ></img>
            <img src={trashIcon} className="trashIcon" id="icon"></img>
          </div>
        </div>
        <div className={styles.box} id="Name">
          <a className={styles.boxTitle}>Brian Bailey</a>
          <div className={styles.icons}>
            <img
              src={eyeIcon}
              className={`${styles.eyeIcon} eyeIcon`}
              id="icon"
            ></img>
            <img src={trashIcon} className="trashIcon" id="icon"></img>
          </div>
        </div>
      </div>
      <button className={styles.addButton}>Add</button>
    </div>
  );
};

export default ClassTeachers;
