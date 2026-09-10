const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveBtn = document.getElementById("saveBtn");
const message = document.getElementById("message");
const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");

async function loadNotes() {
  try {
    const response = await fetch("/api/notes");

    if (!response.ok) {
      throw new Error("Failed to load notes.");
    }

    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    notesContainer.innerHTML = `<p class="empty">Could not load notes. Please try again.</p>`;
  }
}

function renderNotes(notes) {
  noteCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;

  if (notes.length === 0) {
    notesContainer.innerHTML =
      '<p class="empty">No notes yet. Create your first note above ✨</p>';
    return;
  }

  notesContainer.innerHTML = notes
    .map(
      (note) => `
        <article class="note">
          <h3>${escapeHtml(note.title)}</h3>
          <p>${escapeHtml(note.content)}</p>

          <div class="note-footer">
            <span class="note-date">${formatDate(note.createdAt)}</span>
            <button class="delete-btn" onclick="deleteNote('${note.id}')">
              Delete
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

async function createNote(title, content) {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not create note.");
  }

  return data;
}

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    showMessage("Please enter both a title and note.", true);
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    await createNote(title, content);

    noteForm.reset();
    showMessage("Note saved successfully!");
    await loadNotes();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Note";
  }
});

async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;

  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not delete note.");
    }

    showMessage("Note deleted.");
    await loadNotes();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);

  setTimeout(() => {
    message.textContent = "";
    message.classList.remove("error");
  }, 3000);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadNotes();