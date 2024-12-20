/**
 * JavaScript functionality for the "Task Details" page in the DevZen application.
 *
 * This script manages the display and editing of task notes, allowing users to view or update
 * task details and notes in either view or edit mode. It integrates with the Electron API for
 * fetching and saving task data and notes.
 *
 * Key functionalities:
 * - `convertMarkdownToHtml(markdown)`: Converts Markdown-formatted text to HTML, supporting:
 *   - Headings, bold, italic, strikethrough, and inline code.
 *   - Lists (ordered, unordered, and task lists).
 *   - Links and images.
 *   - Blockquotes, horizontal rules, and line breaks.
 * - `loadTaskDetails()`: Fetches the task's details (e.g., name, deadline) from the backend.
 * - `loadNotes()`: Fetches the task's notes, sets up the editor, and initializes the page
 *   in view mode, displaying the task's title, deadline, and rendered notes.
 * - Event listeners:
 *   - `editor` (`input`): Updates the live preview of Markdown as the user types.
 *   - `saveButton` (`click`): Saves the edited notes and switches back to view mode.
 *   - `editButton` (`click`): Switches to edit mode, allowing note editing (disabled for completed tasks).
 *   - `backButton` (`click`): Navigates back to the appropriate page (view or completed tasks).
 *   - `cancelEditButton` (`click`): Cancels editing and switches back to view mode without saving.
 *
 * Associated HTML elements:
 * - `viewModeDiv` (id="view-mode"): Displays task details and notes in view mode.
 * - `editModeDiv` (id="edit-mode"): Allows editing of notes in Markdown format.
 * - `editor` (id="markdown-editor"): Textarea for editing notes.
 * - `preview` (id="preview"): Displays the live Markdown-to-HTML preview during editing.
 * - `notesPreviewDiv` (id="notes-preview"): Displays the rendered HTML version of notes in view mode.
 * - Buttons (`saveButton`, `editButton`, `backButton`, `cancelEditButton`) for interactivity.
 *
 * Integration:
 * - Electron API for fetching (`getNotes`, `getTasks`) and updating (`updateNotes`) task data.
 *
 * This script enhances task management by enabling seamless note viewing and editing
 * with live Markdown rendering, ensuring a smooth user experience.
 */

const urlParams = new URLSearchParams(window.location.search);
const quadrant = urlParams.get('quadrant');
const index = urlParams.get('index');
let mode = urlParams.get('mode') || 'view';
const isCompleted = urlParams.get('completed') === 'true';

const viewModeDiv = document.getElementById('view-mode');
const editModeDiv = document.getElementById('edit-mode');
const notesPreviewDiv = document.getElementById('notes-preview');
const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save-notes');
const editButton = document.getElementById('edit-button');
const backButton = document.getElementById('back-button');
const cancelEditButton = document.getElementById('cancel-edit');
const taskTitle = document.getElementById('task-title');
const taskDeadline = document.getElementById('task-deadline');

function convertMarkdownToHtml(markdown) {
  let result = markdown;

  // Headings
  result = result.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    return `<h${level}>${title}</h${level}>`;
  });

  // Formatting
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');
  result = result.replace(/\~~(.*?)\~~/g, '<s>$1</s>');
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  result = result.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');
  result = result.replace(/^\s*[-]\s*\[\s?x?\s?\]\s+(.*)$/gm, (m, t) => {
    const checked = m.includes('[x]') ? 'checked="checked"' : '';
    return `<p><input type="checkbox" ${checked} disabled> ${t}</p>`;
  });

  // Lists
  result = result.replace(/^[-*+]\s+(.*)$/gm, '<li>$1</li>');
  result = result.replace(/(<li>.*<\/li>[\r\n]+)/g, '<ul>$1</ul>');
  result = result.replace(/<\/ul>\s*<ul>/g, '');
  result = result.replace(/^\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
  result = result.replace(/<\/ol>\s*<ol>/g, '');

  // Images & Links
  result = result.replace(
    /!\[([^\]]+)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width:100%; height:auto;">',
  );
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank">$1</a>',
  );

  // Horizontal rules
  result = result.replace(/^[-*]{3,}$/gm, '<hr>');

  // Line breaks
  result = result.replace(/\n/g, '<br>');

  return result;
}

async function loadTaskDetails() {
  const tasks = await window.electronAPI.getTasks();
  return tasks[quadrant]?.[index] || {};
}

async function loadNotes() {
  const notes = await window.electronAPI.getNotes({ quadrant, index });
  editor.value = notes || '';

  const task = await loadTaskDetails();
  const name = task.name || 'Unnamed Task';
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  let deadlineStr = 'No deadline set';
  if (deadlineDate) {
    const month = (deadlineDate.getMonth() + 1).toString().padStart(2, '0');
    const day = deadlineDate.getDate().toString().padStart(2, '0');
    deadlineStr = `Deadline: ${month}/${day}`;
  }

  taskTitle.textContent = name;
  taskDeadline.textContent = deadlineStr;

  // If completed, hide edit button so user can't edit.
  if (isCompleted) {
    editButton.style.display = 'none';
  }

  // Start in view mode
  mode = 'view';
  viewModeDiv.classList.remove('hidden');
  editModeDiv.classList.add('hidden');
  notesPreviewDiv.innerHTML = convertMarkdownToHtml(notes || '');
}

editor.addEventListener('input', () => {
  const markdownText = editor.value || '';
  try {
    preview.innerHTML = convertMarkdownToHtml(markdownText);
  } catch (error) {
    console.error('Error parsing Markdown:', error);
    preview.innerHTML = '<p style="color: red;">Error rendering preview</p>';
  }
});

saveButton.addEventListener('click', async () => {
  const notes = editor.value;
  await window.electronAPI.updateNotes({ quadrant, index, notes });
  alert('Notes saved!');
  mode = 'view';
  viewModeDiv.classList.remove('hidden');
  editModeDiv.classList.add('hidden');
  notesPreviewDiv.innerHTML = convertMarkdownToHtml(notes || '');
});

editButton.addEventListener('click', () => {
  // Only allow if not completed
  if (!isCompleted) {
    mode = 'edit';
    viewModeDiv.classList.add('hidden');
    editModeDiv.classList.remove('hidden');
    preview.innerHTML = convertMarkdownToHtml(editor.value || '');
  }
});

backButton.addEventListener('click', () => {
  if (quadrant === 'completed') {
    window.location.href = './completed.html';
  } else {
    window.location.href = './view.html';
  }
});

cancelEditButton.addEventListener('click', () => {
  mode = 'view';
  viewModeDiv.classList.remove('hidden');
  editModeDiv.classList.add('hidden');
  notesPreviewDiv.innerHTML = convertMarkdownToHtml(editor.value || '');
});

loadNotes();
