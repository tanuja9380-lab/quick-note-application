# Quick Note Application

A single-page full-stack note-taking web application built for the task requirements.

## Tech stack
- Node.js
- Express.js
- HTML
- CSS
- Vanilla JavaScript
- JSON file storage
- REST API
- Fetch API

## REST API
- `GET /api/notes` - fetch all notes
- `POST /api/notes` - create a note
- `DELETE /api/notes/:id` - delete a note

## Run locally

```bash
npm install
npm start
```

Open:

`http://localhost:3000`

## Submission proof
For submission, provide:
1. GitHub repository URL
2. Deployed live application URL

## Important deployment note
This starter uses a local JSON file for persistence. Some cloud hosting environments use ephemeral filesystems, so notes may reset after a redeploy/restart. For a classroom/demo task this is usually acceptable if JSON storage is allowed. If persistent production storage is required, replace the JSON layer with a database.
