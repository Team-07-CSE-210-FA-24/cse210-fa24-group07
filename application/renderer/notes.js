const urlParams = new URLSearchParams(window.location.search);
const quadrant = urlParams.get('quadrant');
const index = urlParams.get('index');

const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save-notes');
const backButton = document.getElementById('back-button');

function convertMarkdownToHtml(markdown) {
  let result = markdown;

  // Convert multi-line code blocks (triple backticks)
  result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Convert headings (1-6 levels)
  result = result.replace(/^#{1,6}\s*(.*)$/gm, (match, title) => {
    const level = match.split(' ')[0].length; // Count the number of #
    return `<h${level}>${title.trim()}</h${level}>`;
  });

  // Convert blockquotes
  result = result.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

  // Convert bold text
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Convert italic text
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');

  // Convert inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert task lists (checkboxes)
  result = result.replace(/^\s*-\s*$begin:math:display$x$end:math:display$\s+(.*)$/gm, '<input type="checkbox" checked="checked" disabled> $1');
  result = result.replace(/^\s*-\s*$begin:math:display$\\s?$end:math:display$\s+(.*)$/gm, '<input type="checkbox" disabled> $1');

  // Convert unordered lists (-, *, +)
  result = result.replace(/^\s*[-\*\+]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
  result = result.replace(/<\/ul>\s*<ul>/g, ''); // Merge consecutive <ul> tags

  // Convert ordered lists (1., 2., etc.)
  result = result.replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
  result = result.replace(/<\/ol>\s*<ol>/g, ''); // Merge consecutive <ol> tags

  // Convert images
  result = result.replace(/!$begin:math:display$([^$end:math:display$]*)\]$begin:math:text$([^)]+)$end:math:text$/g, '<img src="$2" alt="$1">');

  // Convert links
  result = result.replace(/$begin:math:display$([^$end:math:display$]+)\]$begin:math:text$([^)]+)$end:math:text$/g, '<a href="$2" target="_blank">$1</a>');

  // Convert horizontal rules
  result = result.replace(/^[-\*]{3,}$/gm, '<hr>');

  return result.trim(); // Clean up extra whitespace
}

async function loadNotes() {
  const notes = await window.electronAPI.getNotes({ quadrant, index });
  console.log('Loaded notes:', notes);
  editor.value = notes || '';
  preview.innerHTML = convertMarkdownToHtml(notes || '');
}

editor.addEventListener('input', () => {
  const markdownText = editor.value || '';
  console.log('Markdown input detected:', markdownText);

  try {
    const htmlOutput = convertMarkdownToHtml(markdownText);
    console.log('Generated HTML:', htmlOutput);
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
});

backButton.addEventListener('click', () => {
  window.location.href = './view.html';
});

loadNotes();


module.exports = {
  convertMarkdownToHtml,
};