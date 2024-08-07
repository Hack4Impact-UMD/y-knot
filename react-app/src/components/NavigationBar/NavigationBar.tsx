import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import blackCapIcon from '../../assets/cap-black.svg';
import whiteCapIcon from '../../assets/cap-white.svg';
import blackHomeIcon from '../../assets/home-black.svg';
import whiteHomeIcon from '../../assets/home-white.svg';
import blackLogoutIcon from '../../assets/logout-black.svg';
import blackSettingsIcon from '../../assets/settings-black.svg';
import whiteSettingsIcon from '../../assets/settings-white.svg';
import blackTeachersIcon from '../../assets/teachers-black.svg';
import whiteTeachersIcon from '../../assets/teachers-white.svg';
import x from '../../assets/x.svg';
import yKnotLogo from '../../assets/yknot-logo.png';
import { useAuth } from '../../auth/AuthProvider';
import LogOutConfirmation from './LogOutConfirmation/LogOutConfirmation';
import styles from './NavigationBar.module.css';

const NavigationBar = (): JSX.Element => {
  const authContext = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.id === 'logOut') {
      setShowPopup(true);
    }
  };

  return (
    <>
      <div
        className={menuOpen ? styles.background : ''}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <nav
        className={
          showPopup ? styles.navigationBarPopupOpen : styles.navigationBar
        }
      >
        {authContext?.loading ? (
          <></>
        ) : (
          <>
            <div className={styles.titleContainer}>
              <NavLink to="/">
                <img
                  className={styles.yKnotLogo}
                  src={yKnotLogo}
                  alt="y-knot logo"
                />
              </NavLink>
              <button
                className={styles.menuBtn}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <img src={x} alt="Exit" />
                ) : (
                  <MenuIcon style={{ color: 'e3853a', width: '30px' }} />
                )}
              </button>
            </div>
            <div className={menuOpen ? styles.openMenu : styles.closedMenu}>
              <h2 className={styles.header}>
                {authContext?.token?.claims.role.toUpperCase() === 'ADMIN'
                  ? 'Admin'
                  : 'Teacher'}
              </h2>
              <hr className={styles.breakLine}></hr>
              <div
                className={styles.linkOptionsContainer}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
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
                        alt="House icon"
                      />
                      <img
                        className={styles.iconInactive}
                        src={blackHomeIcon}
                        alt="House Icon"
                      />
                      {authContext?.token?.claims.role === 'ADMIN' ? (
                        <div>Home</div>
                      ) : (
                        <div>Courses</div>
                      )}
                    </div>
                  </NavLink>
                </div>
                {authContext?.token?.claims.role === 'ADMIN' ? (
                  <>
                    <div>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? `${styles.linkOptions} ${styles.highlightOn}`
                            : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
                        }
                        to="/students"
                        id="students"
                      >
                        <div className={styles.tab}>
                          <img
                            className={styles.iconActive}
                            src={whiteCapIcon}
                            alt="Graduation cap icon"
                          />
                          <img
                            className={styles.iconInactive}
                            src={blackCapIcon}
                            alt="Graduation cap icon"
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
                        to="/teachers"
                        id="teachers"
                      >
                        <div className={styles.tab}>
                          <img
                            className={styles.iconActive}
                            src={whiteTeachersIcon}
                            alt="People icon"
                          />
                          <img
                            className={styles.iconInactive}
                            src={blackTeachersIcon}
                            alt="People icon"
                          />
                          Teachers
                        </div>
                      </NavLink>
                    </div>
                  </>
                ) : (
                  <></>
                )}

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
                        alt="Gear icon"
                      />
                      <img
                        className={styles.iconInactive}
                        src={blackSettingsIcon}
                        alt="Gear icon"
                      />
                      Settings
                    </div>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className={`${styles.linkOptionsUnselected} ${styles.highlightOff}`}
                    id="logOut"
                    onClick={handleClick}
                    to=""
                    end
                  >
                    <div className={styles.tab}>
                      <img
                        src={blackLogoutIcon}
                        className={styles.logOutIcon}
                        alt="Logout icon"
                      />
                      Log Out
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
            {showPopup && (
              <LogOutConfirmation
                open={showPopup}
                onClose={() => {
                  setShowPopup(!showPopup);
                }}
              />
            )}
          </>
        )}
      </nav>
    </>
  );
};

export default NavigationBar;
