import styles from './NavigationBar.module.css';
import yKnotLogo from '../../assets/yknot-logo.png';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import whiteHomeIcon from '../../assets/home-white.svg';
import blackHomeIcon from '../../assets/home-black.svg';
import whiteTeachersIcon from '../../assets/teachers-white.svg';
import blackTeachersIcon from '../../assets/teachers-black.svg';
import whiteCapIcon from '../../assets/cap-white.svg';
import blackCapIcon from '../../assets/cap-black.svg';
import whiteSettingsIcon from '../../assets/settings-white.svg';
import blackSettingsIcon from '../../assets/settings-black.svg';
import whiteLogoutIcon from '../../assets/logout-white.svg';
import blackLogoutIcon from '../../assets/logout-black.svg';

const NavigationBar = (): JSX.Element => {
  const authContext = useAuth();

  return (
    <nav className={styles.navigationBar}>
      <div className={styles.titleContainer}>
        <img className={styles.yKnotLogo} src={yKnotLogo} alt="y-knot logo" />
        {authContext?.loading ? (
          <h2 className={styles.header}>&nbsp;</h2>
        ) : (
          <>
            {authContext?.token?.claims.role === 'admin' ? (
              <h2 className={styles.header}>Admin</h2>
            ) : (
              <h2 className={styles.header}>Teacher</h2>
            )}
          </>
        )}
      </div>
      <hr className={styles.breakLine}></hr>
      <div className={styles.linkOptionsContainer}>
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.linkOptions} ${styles.highlightOn}`
                : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
            }
            to="/courses"
            id="home"
          >
            <div className={styles.tab}>
              <img
                className={styles.iconActive}
                src={whiteHomeIcon}
                alt="Icon of a white house"
              />
              <img
                className={styles.iconInactive}
                src={blackHomeIcon}
                alt="Icon of a black house"
              />
              Home
            </div>
          </NavLink>
        </div>
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.linkOptions} ${styles.highlightOn}`
                : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
            }
            to="/nav"
            id="teachers"
            end
          >
            <div className={styles.tab}>
              <img
                className={styles.iconActive}
                src={whiteTeachersIcon}
                alt="White icon of people"
              />
              <img
                className={styles.iconInactive}
                src={blackTeachersIcon}
                alt="Black icon of people"
              />
              Teachers
            </div>
          </NavLink>
        </div>
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.linkOptions} ${styles.highlightOn}`
                : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
            }
            to="/nav"
            id="students"
            end
          >
            <div className={styles.tab}>
              <img
                className={styles.iconActive}
                src={whiteCapIcon}
                alt="White icon of a graduation cap"
              />
              <img
                className={styles.iconInactive}
                src={blackCapIcon}
                alt="Black icon of a graduation cap"
              />
              Students
            </div>
          </NavLink>
        </div>
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.linkOptions} ${styles.highlightOn}`
                : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
            }
            to="/settings"
            id="settings"
            end
          >
            <div className={styles.tab}>
              <img
                className={styles.iconActive}
                src={whiteSettingsIcon}
                alt="White gear icon"
              />
              <img
                className={styles.iconInactive}
                src={blackSettingsIcon}
                alt="Black gear icon"
              />
              Settings
            </div>
          </NavLink>
        </div>
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.linkOptions} ${styles.highlightOn}`
                : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
            }
            to="/nav"
            id="logOut"
            end
          >
            <div className={styles.tab}>
              <img
                className={styles.iconActive}
                src={whiteLogoutIcon}
                alt="White logout icon"
              />
              <img
                className={styles.iconInactive}
                src={blackLogoutIcon}
                alt="Black logout icon"
              />
              Log Out
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
