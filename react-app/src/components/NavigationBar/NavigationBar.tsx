import React, { useState } from 'react';
import styles from './NavigationBar.module.css';
import yKnotLogo from '../../assets/yknot-logo.png';
import { NavLink } from 'react-router-dom';

const NavigationBar = (): JSX.Element => {
  const [activeLink, setActiveLink] = useState('home');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveLink(e.currentTarget.id);
    console.log(e.currentTarget.id);
  };

  return (
    <nav className={styles.navigationBar}>
      <div className={styles.titleContainer}>
        <img className={styles.yKnotLogo} src={yKnotLogo} alt="y-knot logo" />
        <h2 className={styles.adminHeader}>Admin</h2>
      </div>
      <hr className={styles.breakLine}></hr>
      <div className={styles.linkOptionsContainer}>
        <div
          className={
            activeLink === 'home' ? styles.highlightOn : styles.highlightOff
          }
        >
          <NavLink
            className={
              activeLink === 'home'
                ? styles.linkOptions
                : styles.linkOptionsUnselected
            }
            to="/courses"
            id="home"
            onClick={handleClick}
          >
            Home
          </NavLink>
        </div>
        <div
          className={
            activeLink === 'teachers' ? styles.highlightOn : styles.highlightOff
          }
        >
          <NavLink
            className={
              activeLink === 'teachers'
                ? styles.linkOptions
                : styles.linkOptionsUnselected
            }
            to="/nav"
            id="teachers"
            onClick={handleClick}
          >
            Teachers
          </NavLink>
        </div>
        <div
          className={
            activeLink === 'students' ? styles.highlightOn : styles.highlightOff
          }
        >
          <NavLink
            className={
              activeLink === 'students'
                ? styles.linkOptions
                : styles.linkOptionsUnselected
            }
            to="/nav"
            id="students"
            onClick={handleClick}
          >
            Students
          </NavLink>
        </div>
        <div
          className={
            activeLink === 'settings' ? styles.highlightOn : styles.highlightOff
          }
        >
          <NavLink
            className={
              activeLink === 'settings'
                ? styles.linkOptions
                : styles.linkOptionsUnselected
            }
            to="/settings"
            id="settings"
            onClick={handleClick}
          >
            Settings
          </NavLink>
        </div>
        <div
          className={
            activeLink === 'logOut' ? styles.highlightOn : styles.highlightOff
          }
        >
          <NavLink
            className={
              activeLink === 'logOut'
                ? styles.linkOptions
                : styles.linkOptionsUnselected
            }
            to="/nav"
            id="logOut"
            onClick={handleClick}
          >
            Log Out
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
