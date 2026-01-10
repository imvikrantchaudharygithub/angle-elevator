# Google Sheets Integration Setup Guide

## Quick Setup Steps

### Step 1: Open Your Google Sheet
Open this link: https://docs.google.com/spreadsheets/d/14qFHLGFldraZM0MjXZhuzLMqP-PVMmjTsRdDaUng8xo/edit

### Step 2: Open Apps Script
1. Click on **Extensions** in the menu bar
2. Select **Apps Script**

### Step 3: Paste the Code
1. Delete any existing code in the Apps Script editor
2. Open the file `google-apps-script.js` in your project
3. Copy everything starting from `function doPost(e) {` (line 40) to the end of the file
4. Paste it into the Apps Script editor

### Step 4: Save the Script
- Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)
- Or click the **Save** icon (💾)
- Give it a name like "Contact Form Handler"

### Step 5: Deploy as Web App
1. Click the **Deploy** button (top right)
2. Select **New deployment**
3. Click the gear icon (⚙️) next to "Select type"
4. Choose **Web app** from the dropdown

### Step 6: Configure Deployment Settings
Set the following:
- **Description**: "Contact Form Handler" (optional)
- **Execute as**: **Me** (your email)
- **Who has access**: **Anyone** (important!)

### Step 7: Deploy
1. Click **Deploy**
2. You may need to authorize the script (click "Authorize access")
3. Select your Google account
4. Click **Advanced** → **Go to [Project Name] (unsafe)**
5. Click **Allow**

### Step 8: Copy the Web App URL
After deployment, you'll see a **Web app URL** that looks like:
```
https://script.google.com/macros/s/AKfycby.../exec
```
**Copy this entire URL**

### Step 9: Add URL to Your Code
1. Open `script.js` in your project
2. Find line 1116 (look for `const GOOGLE_SCRIPT_URL = "";`)
3. Paste your Web App URL between the quotes:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_URL_HERE/exec";
   ```
4. Save the file

### Step 10: Test It!
1. Refresh your website
2. Fill out the contact form
3. Click "Send brief"
4. Check your Google Sheet - you should see the new entry!

## Troubleshooting

**Error: "Google Sheets integration not configured"**
- Make sure you've completed all steps above
- Verify the URL in `script.js` is correct and includes `https://`
- Make sure there are no extra spaces in the URL

**Form submits but data doesn't appear in sheet**
- Check the Apps Script execution log (View → Executions in Apps Script)
- Verify the SPREADSHEET_ID in the Apps Script code matches your sheet
- Make sure the sheet tab name is correct (default is "Sheet1")

**Permission errors**
- Make sure "Who has access" is set to "Anyone" when deploying
- Re-authorize the script if needed

## Need Help?
Check the `google-apps-script.js` file for the complete code and additional notes.

