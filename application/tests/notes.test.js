describe('Markdown Notes Editor', () => {
    let editor, preview, saveButton, backButton;
    let convertMarkdownToHtml;
  
    beforeEach(() => {
      document.body.innerHTML = `
        <textarea id="markdown-editor"></textarea>
        <div id="preview"></div>
        <button id="save-notes">Save</button>
        <button id="back-button">Back</button>
      `;
  
      global.window = Object.create(window);
      global.window.electronAPI = {
        getNotes: jest.fn().mockResolvedValue('**Initial Notes**'),
        updateNotes: jest.fn().mockResolvedValue(),
      };
  
      delete window.location;
      window.location = { href: '' };
  
      jest.isolateModules(() => {
        const notesModule = require('../renderer/notes');
        convertMarkdownToHtml = notesModule.convertMarkdownToHtml; // Extract the conversion function
      });
  
      editor = document.getElementById('markdown-editor');
      preview = document.getElementById('preview');
      saveButton = document.getElementById('save-notes');
      backButton = document.getElementById('back-button');
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    test('editor input updates the Markdown preview in real-time', () => {
      editor.value = '**Live Update**';
      editor.dispatchEvent(new Event('input'));
  
      expect(preview.innerHTML).toContain('<strong>Live Update</strong>');
    });
  
    test('back button redirects to view.html', () => {
      backButton.click();
      expect(window.location.href).toBe('./view.html');
    });
  
    test('convertMarkdownToHtml correctly converts Markdown to HTML', () => {
        const markdownInput = `
      # Heading 1
      **Bold Text**
      *Italic Text*
      \`Inline Code\`
      `.trim();
      
        const expectedHtml = `
      <h1>Heading 1</h1>
      <strong>Bold Text</strong>
      <em>Italic Text</em>
      <code>Inline Code</code>
      `.trim();
      
        const result = convertMarkdownToHtml(markdownInput);
        expect(result).toBe(expectedHtml);
      });
  });