# Tabs to Markdown Chrome Extension

A lightweight, single-purpose Chrome extension for users who need a fast and simple way to archive their browsing sessions. With a single click, the extension captures all open tabs, uses AI to generate a summary and categorize them, and saves everything as a cleanly formatted Markdown file.

## Features

- **One-Click Save:** Capture all open tabs across all windows with a single click.
- **AI-Powered Summaries:** Uses an OpenAI model (GPT-4o mini) to generate a concise summary and relevant tags for your browsing session.
- **Automatic Categorization:** The AI intelligently groups your tabs by common theme or topic, ensuring no tab is left behind.
- **Interactive Preview:** A side panel opens to show a live HTML preview of the generated Markdown. You can review and even edit the content before saving.
- **Customizable Filenames:** Optionally add a creator name to the output filename for easy identification in shared environments.
- **Modern UI:** A clean, Material Design interface for both the side panel and settings screen.

## Setup & Installation

1.  **Download:** Download this repository as a ZIP file and unzip it, or clone it.
2.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Turn on the "Developer mode" toggle in the top-right corner.
4.  **Load the Extension:** Click the "Load unpacked" button and select the `tabs-2-md` project directory.

## Usage

1.  **Set API Key:** Before first use, you must add your OpenAI API key.
    - Right-click the extension icon (a bookmark symbol) in your Chrome toolbar and select "Options."
    - Enter your OpenAI API key.
    - Optionally, add a "Creator Name" to have your saved filenames prefixed (e.g., `Jesse_2025-09-01...md`).
    - Click "Save Settings."
2.  **Capture Tabs:** Click the extension icon in your toolbar.
3.  **Review:** The side panel will open and generate the summary and categories. You can review the HTML preview or click "Edit" to modify the raw Markdown.
4.  **Save:** Click "Save to File" to download the `.md` file.
