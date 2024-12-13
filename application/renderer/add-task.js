/**
 * JavaScript functionality for the "Add Task" page in the DevZen application.
 *
 * This script provides Markdown-to-HTML conversion and real-time preview functionality
 * for the task description input. It also includes navigation logic for the "Back" button.
 *
 * Key functions:
 * - `convertMarkdownToHtml(markdown)`: Converts a Markdown-formatted string into HTML
 *   using regex-based replacements to support various Markdown features, such as:
 *   - Headings (#, ##, etc.)
 *   - Bold and italic text
 *   - Strikethrough (~~text~~)
 *   - Inline and block code (`code` or ```code```)
 *   - Blockquotes (>)
 *   - Task lists (e.g., - [ ] Task)
 *   - Ordered and unordered lists
 *   - Images (![alt text](URL))
 *   - Links ([text](URL))
 *   - Horizontal rules (--- or ***)
 *   - Line breaks
 *
 * - Event listener for the "markdown-input" textarea:
 *   - Updates the preview section in real-time with the HTML version of the inputted Markdown.
 *   - Displays or hides the preview based on whether content is present in the textarea.
 *
 * - Event listener for the "Back" button:
 *   - Redirects the user to the "view.html" page when clicked.
 *
 * Associated HTML elements:
 * - `textarea` (id="markdown-input"): Input field for task description in Markdown format.
 * - `previewDiv` (id="preview"): Section where the converted HTML preview is displayed.
 * - `backButton` (id="back-button"): Button to navigate back to the previous page.
 *
 * This script enhances user interaction on the "Add Task" page by allowing users to
 * see a live preview of their Markdown-formatted task description and navigate seamlessly.
 */

function convertMarkdownToHtml(markdown) {
  let result = markdown;
  // Convert headings
  result = result.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    return `<h${level}>${title}</h${level}>`;
  });

  // Bold
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');

  // Strikethrough
  result = result.replace(/\~~(.*?)\~~/g, '<s>$1</s>');

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Code blocks
  result = result.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Blockquotes
  result = result.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

  // Task lists
  result = result.replace(/^\s*[-]\s*\[\s?x?\s?\]\s+(.*)$/gm, (match, task) => {
    const checked = match.includes('[x]') ? 'checked="checked"' : '';
    return `<input type="checkbox" ${checked} disabled> ${task}`;
  });

  // Unordered lists
  result = result.replace(/^\s*[-*+]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
  result = result.replace(/<\/ul>\s*<ul>/g, '');

  // Ordered lists
  result = result.replace(/^\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
  result = result.replace(/<\/ol>\s*<ol>/g, '');

  // Images
  result = result.replace(
    /!\[([^\]]+)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1">',
  );

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank">$1</a>',
  );

  // Horizontal rule
  result = result.replace(/^[-*]{3,}$/gm, '<hr>');

  // Line breaks
  result = result.replace(/\n/g, '<br>');

  return result;
}

const textarea = document.getElementById('markdown-input');
const previewDiv = document.getElementById('preview');
const backButton = document.getElementById('back-button');

textarea.addEventListener('input', () => {
  const markdownText = textarea.value.trim();
  if (markdownText) {
    previewDiv.style.display = 'block';
    previewDiv.innerHTML = convertMarkdownToHtml(markdownText);
  } else {
    previewDiv.style.display = 'none';
  }
});

backButton.addEventListener('click', () => {
  window.location.href = './view.html';
});
