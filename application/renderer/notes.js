const urlParams = new URLSearchParams(window.location.search);
const quadrant = urlParams.get('quadrant');
const index = urlParams.get('index');

const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save-notes');
const backButton = document.getElementById('back-button');


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

    // Convert task lists (checkboxes)
    markdown = markdown.replace(/^\s*[-]\s*\[\s?x?\s?\]\s+(.*)$/gm, (match, task) => {
        const checked = match.includes('[x]') ? 'checked="checked"' : '';
        return `<input type="checkbox" ${checked} disabled> ${task}`;
    });

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