# Grambam Project Management Application
![alt text](https://github.com/Greyhamm/GramBam/blob/main/public/GrambamHomepage.png?raw=true)
## Table of Contents

- [Grambam Project Management Application](#grambam-project-management-application)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
  - [Authentication](#authentication)
  - [Database](#database)
  - [Styling](#styling)
  - [Performance](#performance)
  - [Contributing](#contributing)

## Introduction

Grambam is a comprehensive project management application designed to help teams collaborate effectively. It provides a robust platform for managing companies, projects, records, and tasks, with features like user authentication, role-based access control, and real-time notifications.

## Features

- User authentication (signup, login, logout)
- Company management
- Project creation and management
- Record tracking within projects
- Task management with status tracking (pending, in progress, completed)
- Role-based access control (manager, supervisor, employee)
- User invitations to join companies
- Editable project and record details
- Responsive design for various screen sizes

## Technology Stack

- **Frontend**: React, Next.js
- **Backend**: Next.js API routes
- **Database**: PostgreSQL
- **Authentication**: Custom implementation with iron-session
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js file-based routing
- **Performance Monitoring**: Vercel Speed Insights

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/grambam.git
   ```

2. Navigate to the project directory:

   ```
   cd grambam
   ```

3. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add necessary environment variables (e.g., database connection strings, session secret).

5. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows a typical Next.js structure with some additional organizational patterns:

- `/app`: Contains the main application pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions, type definitions, and shared constants
- `/actions`: Server-side actions for data fetching and manipulation
- `/public`: Static assets

## Key Components

- `Navbar`: The main navigation component
- `LoginForm` and `SignupForm`: User authentication forms
- `ProjectForm`: For creating new projects
- `EditableProjectDetails`: Allows editing of project details
- `AddRecordForm`: For adding new records to a project
- `TaskList`: Displays tasks for a record
- `ViewTaskModal` and `EditTaskModal`: For viewing and editing tasks
- `NotificationDropdown`: Displays user notifications

## Authentication

The application uses a custom authentication system implemented with iron-session. Key files related to authentication include:

- `loginForm.tsx` and `signupForm.tsx` for user input
- `login` and `signup` actions in the server-side code
- `getSession` action to retrieve the current user session

## Database

The application interacts with a PostgreSQL database, hosted by Vercel, through various actions defined in the `actions` directory. These include operations for managing users, companies, projects, records, and tasks.

## Styling

The project uses Tailwind CSS for styling, providing a responsive and modern design. Custom styles are defined in `globals.css`.

## Performance

The application uses Vercel Speed Insights for performance monitoring, as seen in the `layout.tsx` file.

## Contributing

Contributions to Grambam are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request
