// 1. Open the side panel when the user clicks the extension icon.
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 2. Listen for messages from the side panel.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'processTabs') {
    // Use an async IIFE to handle the async logic
    (async () => {
      try {
        const { apiKey } = await chrome.storage.local.get('apiKey');
        if (!apiKey) {
          throw new Error('API key not found.');
        }

        const tabs = await chrome.tabs.query({});
        
        // Create the raw list of tabs for the prompt and for the final output
        const rawTabListForPrompt = tabs.map(tab => `- ${tab.title}: ${tab.url}`).join('\n');
        const rawTabListForFile = tabs.map(tab => {
          try {
            const domain = new URL(tab.url).hostname;
            return `- [${domain} - ${tab.title}](${tab.url})`;
          } catch (e) {
            return `- [${tab.title}](${tab.url})`;
          }
        }).join('\n');

        const prompt = `You are a helpful assistant that categorizes browser tabs. Your task is to categorize EVERY SINGLE TAB from the list I provide into a relevant group. DO NOT OMIT ANY TABS.

First, provide:
1. A short, 1-2 sentence overall summary of the browsing session.
2. A line of relevant tags (e.g., #design #research #python).

Next, categorize all of the tabs from the list below into groups based on their common theme. If a tab does not fit into a clear group, place it under a "Miscellaneous" category.

CRUCIALLY, the total number of tabs in all your categorized groups must equal the total number of tabs I provide.

Format the output as follows, and do not include the original list of tabs in the response:

SUMMARY: [Your 1-2 sentence summary]
TAGS: #tag1 #tag2 #tag3

### [Category 1]
- [Title 1](URL 1)
- [Title 2](URL 2)

### [Category 2]
- [Title 3](URL 3)

Here is the list of tabs to categorize:
${rawTabListForPrompt}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const aiContent = data.choices[0].message.content.trim();

        // Combine AI content with the raw tab list
        const finalContent = `${aiContent}\n\n---\n\n### All Tabs\n${rawTabListForFile}`;

        // Send the final content back to the side panel
        chrome.runtime.sendMessage({ type: 'processingComplete', content: finalContent });

      } catch (error) {
        console.error('Error:', error);
        chrome.runtime.sendMessage({ type: 'processingError', error: error.message });
      }
    })();
    return true; // Indicates that the response will be sent asynchronously.
  }

  if (message.type === 'saveFile') {
    (async () => {
      const { creatorName } = await chrome.storage.local.get('creatorName');
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      
      const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}`;
      const filename = creatorName ? `${creatorName}_${timestamp}_Tabs.md` : `${timestamp}_Tabs.md`;

      const url = 'data:text/markdown;charset=UTF-8,' + encodeURIComponent(message.content);

      chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: false
      }, () => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.svg',
          title: 'Tabs Saved',
          message: `Your tabs have been saved to ${filename}`
        });
      });
    })();
  }
});