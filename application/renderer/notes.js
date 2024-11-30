const urlParams = new URLSearchParams(window.location.search);
const quadrant = urlParams.get('quadrant');
const index = urlParams.get('index');

const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save-notes');
const backButton = document.getElementById('back-button');

(async function loadNotes() {
  const notes = await window.electronAPI.getNotes({ quadrant, index });
  editor.value = notes;
  preview.innerHTML = marked(notes); 
})();


editor.addEventListener('input', () => {
  const markdownText = editor.value;
  preview.innerHTML = marked(markdownText);
});


saveButton.addEventListener('click', async () => {
  const notes = editor.value;
  await window.electronAPI.updateNotes({ quadrant, index, notes });
  alert('Notes saved!');
});


backButton.addEventListener('click', () => {
    window.location.href = './view.html';
  });