const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const markdownTextarea = document.getElementById('markdown-content');
const previewContentDiv = document.getElementById('preview-content');
const saveButton = document.getElementById('save');
const toggleEditButton = document.getElementById('toggle-edit');
const optionsButton = document.getElementById('options-button');

let isEditMode = false;

// --- Helper function to convert our specific Markdown to HTML ---
function markdownToHtml(md) {
  return md
    .split('\n')
    .map(line => {
      line = line.trim();
      if (line.startsWith('SUMMARY:')) {
        return `<p><strong>SUMMARY:</strong> ${line.substring(8).trim()}</p>`;
      }
      if (line.startsWith('TAGS:')) {
        return `<p><strong>TAGS:</strong> ${line.substring(5).trim()}</p>`;
      }
      if (line.startsWith('### All Tabs')) {
        return '<hr><h3>All Tabs</h3>';
      }
      if (line.startsWith('###')) {
        return `<h3>${line.substring(3).trim()}</h3>`;
      }
      if (line.startsWith('- [')) {
        const match = line.match(/- \[(.*)\]\((.*)\)/);
        if (match) {
          const text = match[1];
          const url = match[2];
          return `<ul><li><a href="${url}" target="_blank">${text}</a></li></ul>`;
        }
      }
      if (line.trim() === '---') {
        return '<hr>';
      }
      return line ? `<p>${line}</p>` : '<br>';
    })
    .join('');
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ type: 'processTabs' });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'processingComplete') {
    const rawMarkdown = message.content;
    
    // Populate both the textarea (for editing) and the preview div
    markdownTextarea.value = rawMarkdown;
    previewContentDiv.innerHTML = markdownToHtml(rawMarkdown);

    // Show the results
    statusDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
  } else if (message.type === 'processingError') {
    statusDiv.innerHTML = `<p>Error: ${message.error}</p><p>Please check your API key in the extension options and try again.</p>`;
  }
});

toggleEditButton.addEventListener('click', () => {
  isEditMode = !isEditMode;
  if (isEditMode) {
    // Switch to Edit mode
    previewContentDiv.classList.add('hidden');
    markdownTextarea.classList.remove('hidden');
    toggleEditButton.textContent = 'Preview';
    // If user edits and then previews, we need to re-render
    markdownTextarea.focus();
  } else {
    // Switch to Preview mode
    previewContentDiv.innerHTML = markdownToHtml(markdownTextarea.value);
    markdownTextarea.classList.add('hidden');
    previewContentDiv.classList.remove('hidden');
    toggleEditButton.textContent = 'Edit';
  }
});

saveButton.addEventListener('click', () => {
  // Always save the content from the textarea, as it's the source of truth
  const finalContent = markdownTextarea.value;
  chrome.runtime.sendMessage({ type: 'saveFile', content: finalContent });
});

optionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});