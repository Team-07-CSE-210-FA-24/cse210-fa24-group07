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
  result = result.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

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
