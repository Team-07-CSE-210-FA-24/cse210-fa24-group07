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

  // Bold/Italic/Strikethrough/Code formatting
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');
  result = result.replace(/\~~(.*?)\~~/g, '<s>$1</s>');
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Blockquotes
  result = result.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

  // Task lists
  result = result.replace(/^\s*[-]\s*\[\s?x?\s?\]\s+(.*)$/gm, (match, task) => {
    const checked = match.includes('[x]') ? 'checked="checked"' : '';
    return `<p><input type="checkbox" ${checked} disabled> ${task}</p>`;
  });

  // Unordered lists
  result = result.replace(/^[-\*\+]\s+(.*)$/gm, '<li>$1</li>');
  result = result.replace(/(<li>.*<\/li>)(?![\r\n]|$)/g, '$1');
  result = result.replace(/(<li>.*<\/li>[\r\n]+)/g, '<ul>$1</ul>');

  // Ordered lists
  result = result.replace(/^\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
  result = result.replace(/<\/ol>\s*<ol>/g, '');

  // Images
  result = result.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; height:auto;">');

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Horizontal rule
  result = result.replace(/^[-\*]{3,}$/gm, '<hr>');

  // Line breaks
  result = result.replace(/\n/g, '<br>');

  return result;
}

async function loadTaskDetails() {
  const tasks = await window.electronAPI.getTasks();
  let task;

  if (tasks[quadrant] && tasks[quadrant][index]) {
    task = tasks[quadrant][index];
  }

  return task || {};
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

  if (isCompleted) {
    // If the task is completed, no editing allowed
    editButton.style.display = 'none';
  }

  if (mode === 'view') {
    viewModeDiv.classList.remove('hidden');
    editModeDiv.classList.add('hidden');
    notesPreviewDiv.innerHTML = convertMarkdownToHtml(notes || '');
  } else {
    // mode=edit (Only possible if not completed)
    if (!isCompleted) {
      viewModeDiv.classList.add('hidden');
      editModeDiv.classList.remove('hidden');
      preview.innerHTML = convertMarkdownToHtml(notes || '');
    } else {
      // If completed and somehow mode=edit is requested, fallback to view
      mode = 'view';
      viewModeDiv.classList.remove('hidden');
      editModeDiv.classList.add('hidden');
      notesPreviewDiv.innerHTML = convertMarkdownToHtml(notes || '');
    }
  }
}

editor.addEventListener('input', () => {
  const markdownText = editor.value || '';
  try {
    const htmlOutput = convertMarkdownToHtml(markdownText);
    preview.innerHTML = htmlOutput;
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
  if (!isCompleted) {
    // Switch to edit mode only if not completed
    mode = 'edit';
    viewModeDiv.classList.add('hidden');
    editModeDiv.classList.remove('hidden');
    preview.innerHTML = convertMarkdownToHtml(editor.value || '');
  }
});

backButton.addEventListener('click', () => {
  // If this was a completed task, go back to completed list view
  // Otherwise, go back to main matrix view
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
