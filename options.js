document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const creatorNameInput = document.getElementById('creatorName');
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');

  // Load the saved settings when the options page is opened
  chrome.storage.local.get(['apiKey', 'creatorName'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
    if (result.creatorName) {
      creatorNameInput.value = result.creatorName;
    }
  });

  // Save the settings
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    const creatorName = creatorNameInput.value;

    chrome.storage.local.set({ apiKey: apiKey, creatorName: creatorName }, () => {
      status.textContent = 'Settings saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
  });
});