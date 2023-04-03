# Y-KNOT Course Management Portal

# Point of Contact
For inquiries about the project, contact 
- Sahil Gaba (sgaba9778@gmail.com)
- Sophie Tsai (sophietsai31@gmail.com).

# Project Info
[Y-KNOT](https://www.yknotinc.org/home) is an organization founded by Regina Gibbons that provides educational programs to students and adults in the Prince George’s County area. 

Currently, Y-KNOT relies on various technologies including [Wix](https://www.wix.com/), [Jotform](https://www.jotform.com/), Microsoft Excel, and email to manage class and student data. These platforms are used for a range of functions such as student sign up, payment collection, storage of student information, sending class information and certificates, and more. However, this fragmented system requires Regina and teachers to manually navigate between different patforms to retreive necessary information and manage classroom tasks, which can be time-consuming. So, Y-KNOT would like a course management tool which integrates and centralizes all of these functions and allows teachers to automate classroom management tasks.

# Tech Stack
- Our frontend is TypeScript, React, and CSS Modules.
- Our backend is TypeScript and Firebase.
- Y-KNOT uses Wix forms to obtain student sign up and payment information. We will grab information from these forms.
<!-- Infrastructure diagram -->

# Running the Repo Locally
1. Clone the repo and `cd` into it
3. Run `npm install` in the `react-app` directory
4. Run `npm start` in the `react-app` directory
5. Navigate to http://localhost:3000/ in your browser

# Hosting
We are currently using Firebase Hosting. You can view a dev deployment of the application at https://yknot-42027.web.app/login

---
# Backend Structure

## Firebase
Contact Sahil or Sophie to gain access to our Firebase Console.

Once logged in to the Firebase Console, you can view our stored data by clicking on the "Firestore Database" tab.

We currently have 3 collections which corresponds to our project Types:
- Courses
- Students
- Users (Teachers and Admin accounts)

---
# Project Structure
Preferred practices used for this project can be found [here](https://docs.google.com/document/d/1xvTzr924g-AdLrsiXV2TH-g51YwWqS-KANRcvYWpIUE/edit#heading=h.epmqipk5l7nc)

## Assets
Global assets folder storing all images used throughout the project.

## Auth
Folder storing authentication related files.

## Backend
Folder storing files for backend calls to Firebase.

## Backend Testing
Folder containing functions for backend testing. 

## Components
Global components folder storing components used across multiple pages.

## Config
Folder storing the Firebase configuration.

## Pages
Folder with sub-folders for specific pages containing the main Typescript and CSS files. These page folders may contain additional sub-folders for each component used on the page. Each folder should contain the x.tsx file and corresponding x.module.css file.

## Types
Folder storing commonly used types where each component can access it. This currently includes the `CourseType`, `StudentType`, and `UserType`.
