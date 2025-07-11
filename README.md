# ai-agent-jobs

## Overview

This n8n workflow automates the job application process by analyzing a resume, extracting key skills, searching for relevant job listings, and generating personalized cover letters for each job. The final results are compiled into a Google Sheet and emailed to the user.

## Features

- Extracts key skills from the user's resume.

- Searches for relevant job postings based on extracted skills.

- Generates a tailored cover letter for each job.

- Saves job details and cover letters into a Google Sheet.

- Sends an email to the user with the sheet attached.

## Prerequisites

- n8n installed (Cloud, Docker, or Self-Hosted instance).

- API keys for job listing services (if required).

- Google Sheets API access (for storing job applications).

- Email SMTP credentials (for sending notifications).

## Workflow Steps

- Receive Resume Input

  - Extracts text from the resume file.

- Identify Key Skills

  - Parses resume text to extract the most relevant skills.

- Search for Job Listings

  - Uses job search APIs to find matching job opportunities.

- Generate Cover Letters

  - Uses AI to write personalized cover letters for each job.

- Save to Google Sheets

  - Stores job details and cover letters in a spreadsheet.

- Send Email Notification

  - Attaches the spreadsheet and emails it to the user.

## N8N-Flow-Configuration

### Google Sheets API Setup

1. Go to the Google Cloud Console.

2. Create a new project and enable the Google Sheets API.

3. Create credentials (OAuth 2.0 Client ID or Service Account).

4. Copy the Client ID and Client Secret, then add them to the Google Sheets node in n8n.

5. Click the "Sign in with Google" button, choose your registered Google Cloud account, then click the "Continue" button and select all permissions.

### Google Drive API Setup

1. Enable the Google Drive API in the Google Cloud Console.

2. Use the same credentials from Google Sheets API.

3. Set up file permissions to allow n8n to manage files.

### Gemini API Key Setup

1. Obtain a Gemini API key from the Google AI Platform.

2. Add the API key to the Gemini node in n8n.

### SMTP Configuration

1. Obtain SMTP credentials from your email provider (e.g., Gmail, Outlook, or a custom SMTP service).

2. Set up an SMTP node in n8n with the following details:

   - SMTP Server: (e.g., smtp.gmail.com)

   - Port: (465 for SSL, 587 for TLS)

   - Username: Your email address

   - Password: Your SMTP password or app-specific password

## App Configuration

1- clone the app using this command

```
git clone https://github.com/code-quests/ai-agent-jobs.git
```

2- install dependancies

```
npm install
```

3- create .env file at the root folder

```
touch .env
```

4- add these variables

```
VITE_GOOGLE_CLIENT_ID="your google client id"
VITE_REQUESTS_SHEET_ID="the sheet id for storing requests"
VITE_GOOGLE_API_KEY="your google api key"
```

5- run the application

```
npm run dev
```
