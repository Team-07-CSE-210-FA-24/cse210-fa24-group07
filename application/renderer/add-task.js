function convertMarkdownToHtml(markdown) {
    // Convert headings
    markdown = markdown.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, title) => {
        const level = hashes.length;
        return `<h${level}>${title}</h${level}>`;
    });

    // Convert bold text
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Convert italic text
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    markdown = markdown.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Convert strike-through text
    markdown = markdown.replace(/\~~(.*?)\~~/g, '<s>$1</s>');

    // Convert code blocks (inline code)
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert multi-line code blocks (triple backticks)
    markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert blockquotes
    markdown = markdown.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

    // Convert unordered lists (-, *, +)
    markdown = markdown.replace(/^\s*[-\*\+]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
    markdown = markdown.replace(/<\/ul>\s*<ul>/g, ''); // Collapse nested <ul> tags to one level

    // Convert ordered lists (1.)
    markdown = markdown.replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
    markdown = markdown.replace(/<\/ol>\s*<ol>/g, ''); // Collapse nested <ol> tags to one level

    // Convert images
    markdown = markdown.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Convert links
    markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Convert horizontal rule (3 dashes or asterisks)
    markdown = markdown.replace(/^[-\*]{3,}$/gm, '<hr>');

    // Convert line breaks
    markdown = markdown.replace(/\n/g, '<br>');

    return markdown;
}

// Function to update the preview div with converted Markdown
function updatePreview() {
    const markdownText = textarea.value;
    const htmlText = convertMarkdownToHtml(markdownText);
    previewDiv.innerHTML = htmlText;  // Display the converted HTML in the preview div
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
textarea.addEventListener('focus', function() {
    textarea.style.display = 'block';   // Show textarea
    previewDiv.style.display = 'none';  // Hide previewDiv
    textarea.value = userInput;
});

// When user clicks outside textarea
textarea.addEventListener('blur', function() {
    if (textarea.value.trim() === "") {
        userInput = '';
        textarea.style.display = 'block';   // Keep showing textarea
        previewDiv.style.display = 'none';  // Keep hiding preview
        return;
    }
    userInput = textarea.value; 

    updatePreview();                     // Convert the raw Markdown text to HTML
    textarea.style.display = 'none';     // Hide textarea
    previewDiv.style.display = 'block';  // Show previewDiv
});

//  When user clicks on previewDiv
previewDiv.addEventListener('click', function() {
    textarea.style.display = 'block';   // Show textarea
    previewDiv.style.display = 'none';  // Hide previewDiv
    textarea.focus();  
});