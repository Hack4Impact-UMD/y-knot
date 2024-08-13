# Y-KNOT Course Management Portal

# Point of Contact

For inquiries about the project, contact

- Sophie Tsai (sophietsai31@gmail.com)
- Sahil Gaba (sgaba9778@gmail.com)

# Project Info

[Y-KNOT](https://www.yknotinc.org/home) is an organization founded by Regina Gibbons that provides educational programs to students and adults in the Prince George’s County area.

Currently, Y-KNOT relies on various technologies including [Wix](https://www.wix.com/), [Jotform](https://www.jotform.com/), Microsoft Excel, and email to manage class and student data. These platforms are used for a range of functions such as student sign-up, payment collection, storage of student information, sending class information and certificates, and more. However, this fragmented system requires Regina and teachers to manually navigate between different platforms to retrieve necessary information and manage classroom tasks, which can be time-consuming. So, Y-KNOT would like a course management tool that integrates and centralizes all of these functions and allows teachers to automate classroom management tasks.

# Tech Stack

- Our frontend is TypeScript, React, and CSS Modules.
- Our backend is TypeScript and Firebase.
- Jotform is an online form service used to register students for courses.

Diagram of the current project infrastructure:
<br/>
<img width="700" alt="Y-KNOT Infrastructure Diagram" src="https://github.com/user-attachments/assets/0289bd3d-82d1-440b-814e-50d61c51aee5">

# Running the Repo Locally

1. Clone the repo and `cd` into it
2. Run `npm install` in the `react-app` directory
3. Run `npm start` in the `react-app` directory
4. Navigate to http://localhost:3000/ in your browser

# Hosting

We are currently using Firebase Hosting. You can view a dev deployment of the application at https://yknot-42027.web.app/login

---

# Project Structure

## Backend - Firebase

Contact Sahil or Sophie to gain access to our Firebase Console.

Once logged in to the Firebase Console, you can view our stored data by clicking on the "Firestore Database" tab.

We currently have 5 collections that correspond to our project Types:

- Courses
- LeadershipApplications
- Students
- StudentMatches (Suggested student merges)
- Users (Teachers and Admin accounts)
  <img width="1000" alt="Y-KNOT Types Diagram" src="https://github.com/user-attachments/assets/7512aa11-cd6d-4039-9688-a603b5a3bad2">


## File Organization & Preferred Practices

Documentation on the preferred practices used for this project can be found **[here](preferred-practices.md)**

Note:

- We are using a singular global assets folder: `/assets`.
- Only components used across multiple pages are stored in the global components folder: `/components`.
- The Typescript and CSS files for each page can be found in `/pages`. The specific page folders may contain additional sub-folders for each component used on the page for organization. Each folder should contain the x.tsx file and corresponding x.module.css file.
