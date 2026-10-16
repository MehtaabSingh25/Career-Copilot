# Career Copilot

Career Copilot is an AI-powered career assistance platform that helps users understand their resumes, evaluate their fit for job opportunities, tailor resume content, and get career guidance through an AI chat assistant.

## Features

- **Resume analysis** — upload a resume and receive AI-generated feedback and insights.
- **Resume history and comparison** — revisit previous resume analyses and compare results.
- **Job matching** — compare a resume with job requirements and review a match score and supporting feedback.
- **Job match history** — revisit previously saved job matches.
- **Resume tailoring** — generate targeted resume content, including a professional summary, skills, experience bullets, project bullets, keywords, change notes, and cautions.
- **Resume export** — export tailored resume content as an HTML file that can be opened in a browser and printed or saved as a PDF.
- **Career Copilot Chat** — ask career-related questions with optional resume context.
- **Persistent chat history** — reopen previous conversations and continue them.
- **Account features** — authenticated access and profile/settings functionality.

AI-generated recommendations should be reviewed for accuracy before being used in applications.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide icons

### Backend
- Node.js
- Express
- TypeScript
- MongoDB and Mongoose
- Gemini API for AI-powered features
- PDF text extraction
- Cloudinary for file/media storage
- JWT-based authentication

## Project Structure

```text
Career-Copilot/
├── frontend/   # Next.js web application
└── backend/    # Express API, business logic, and tests
```

## Prerequisites

Install the following before running the project locally:

- Node.js and npm
- A MongoDB database (local or hosted)
- API credentials for the external services enabled in your setup, such as Gemini and Cloudinary

## Local Development

Run the frontend and backend in separate terminals.

### 1. Clone the repository

```bash
git clone https://github.com/MehtaabSingh25/Career-Copilot.git
cd Career-Copilot
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create the backend environment file expected by the backend configuration. Add the required database connection, authentication/JWT, AI provider, file-storage, and frontend-origin settings using the variable names defined in the backend source/configuration. Do not commit real credentials or secret values.

Start the backend using the development script defined in `backend/package.json` (commonly `npm run dev`).

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file expected by the frontend configuration and set the backend API base URL to your local backend address.

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Configuration note:** Environment-variable names and available scripts should be taken from the current `backend` and `frontend` configuration files. Keep local `.env` files and secrets out of version control.

## Testing and Build Checks

Run commands from the relevant package directory.

### Backend

```bash
cd backend
npm test
npm run build
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

These checks validate the current codebase; successful local checks do not by themselves guarantee that production environment variables or external services are configured correctly.

## Deployment

The application is deployed as two services:

- **Frontend:** Vercel
- **Backend API:** Render

Configure the production environment variables in the respective hosting dashboards. Ensure the frontend points to the deployed backend API, the backend allows requests from the deployed frontend origin, and the backend has valid database and third-party service credentials. Never expose private API keys or JWT secrets in frontend code.

## Security Notes

- Never commit `.env` files, API keys, database credentials, or JWT secrets.
- Use strong, unique secrets in production.
- Restrict database and storage access to the required services.
- Treat AI output as assistance, not a guarantee of employment outcomes or factual correctness.

## Contributing

1. Create a focused branch for your change.
2. Make the change and run the relevant tests, lint checks, and build.
3. Commit only the intended files.
4. Open a pull request describing the change and how it was tested.

## License

No license information is specified here. Add a `LICENSE` file and update this section if the project is released under a particular license.
