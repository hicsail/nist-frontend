# NIST Frontend

## Introduction

The NIST-Racer project is an effort to provide a platform for working on the COVID-19 Antigen across many research groups. This repository contains client side code for a React application that serves as the frontend for this project.

## Getting Started

### Installation

```
npm install
```

### Configuration

There are a few environment variables needed in order to make the application running properly. For running locally, you can create a `.env` file to store them. Required environment variables are the following:

- `VITE_AUTH_URL`
- `VITE_PROJECT_ID`
- `VITE_AUTHSERVICE_URL`
- `VITE_S3_ENDPOINT`
- `VITE_CARGO_ENDPOINT`

### Build

This step is necessary for deployment. If you are running it on local machine, you can skip this step.

```
npm run build
```

### Running the App

```
npm run dev
```

This command will run the application in development mode. By default, it should be running at http://localhost:5173. At first, you will be redirected to the authentication page. You will need an account to access the dashboard. By default, new user will not have access to any bucket. Please contact admin for permissions.

To stop the application, press <kbd>CTRL</kbd>+<kbd>C</kbd> at the console.
