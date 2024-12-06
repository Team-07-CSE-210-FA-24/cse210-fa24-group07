function convertMarkdownToHtml(markdown) {
  let result = markdown;
  // Convert headings
  result = result.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    return `<h${level}>${title}</h${level}>`;
  });

  // Convert bold text
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Convert italic text
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');

  // Convert strike-through text
  result = result.replace(/\~~(.*?)\~~/g, '<s>$1</s>');

  // Convert code blocks (inline code)
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert multi-line code blocks (triple backticks)
  result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Convert blockquotes
  result = result.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

  // Convert task lists (checkboxes)
  result = result.replace(/^\s*[-]\s*\[\s?x?\s?\]\s+(.*)$/gm, (match, task) => {
    const checked = match.includes('[x]') ? 'checked="checked"' : '';
    return `<input type="checkbox" ${checked} disabled> ${task}`;
  });

  // Convert unordered lists (-, *, +)
  result = result.replace(/^\s*[-\*\+]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
  result = result.replace(/<\/ul>\s*<ul>/g, ''); // Collapse nested <ul> tags to one level

  // Convert ordered lists (1.)
  result = result.replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
  result = result.replace(/<\/ol>\s*<ol>/g, ''); // Collapse nested <ol> tags to one level

  // Convert images
  result = result.replace(
    /!\[([^\]]+)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1">',
  );

  // Convert links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank">$1</a>',
  );

  // Convert horizontal rule (3 dashes or asterisks)
  result = result.replace(/^[-\*]{3,}$/gm, '<hr>');

  // Convert line breaks
  result = result.replace(/\n/g, '<br>');

  return result;
}

// Function to update the preview div with converted Markdown
function updatePreview() {
  const markdownText = textarea.value;
  const htmlText = convertMarkdownToHtml(markdownText);
  previewDiv.innerHTML = htmlText; // Display the converted HTML in the preview div
}

// Get reference to the textarea and previewDiv element
const textarea = document.getElementById('markdown-input');
const previewDiv = document.getElementById('preview');

// Stores what user has written so far
let userInput = '';

// Initial visibility
textarea.style.display = 'block';
previewDiv.style.display = 'none';

// When user clicks on textarea
textarea.addEventListener('focus', () => {
  textarea.style.display = 'block'; // Show textarea
  previewDiv.style.display = 'none'; // Hide previewDiv
  textarea.value = userInput;
});

// When user clicks outside textarea
textarea.addEventListener('blur', () => {
  if (textarea.value.trim() === '') {
    userInput = '';
    textarea.style.display = 'block'; // Keep showing textarea
    previewDiv.style.display = 'none'; // Keep hiding preview
    return;
  }
  userInput = textarea.value;

  updatePreview(); // Convert the raw Markdown text to HTML
  textarea.style.display = 'none'; // Hide textarea
  previewDiv.style.display = 'block'; // Show previewDiv
});

//  When user clicks on previewDiv
previewDiv.addEventListener('click', () => {
  textarea.style.display = 'block'; // Show textarea
  previewDiv.style.display = 'none'; // Hide previewDiv
  textarea.focus();
});

backButton.addEventListener('click', () => {
  window.location.href = './view.html';
});
