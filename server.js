const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function readNotes() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), "utf8");
}

// GET /api/notes - get all notes
app.get("/api/notes", (req, res) => {
  try {
    const notes = readNotes().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Could not read notes." });
  }
});

// POST /api/notes - create a note
app.post("/api/notes", (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const content = String(req.body.content || "").trim();

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required."
      });
    }

    const notes = readNotes();

    const note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString()
    };

    notes.push(note);
    writeNotes(notes);

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Could not create note." });
  }
});

// DELETE /api/notes/:id - delete a note
app.delete("/api/notes/:id", (req, res) => {
  try {
    const notes = readNotes();
    const originalLength = notes.length;

    const updatedNotes = notes.filter((note) => note.id !== req.params.id);

    if (updatedNotes.length === originalLength) {
      return res.status(404).json({ error: "Note not found." });
    }

    writeNotes(updatedNotes);
    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Could not delete note." });
  }
});

// Serve the single-page frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

ensureDataFile();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Quick Note Application running on port ${PORT}`);
});