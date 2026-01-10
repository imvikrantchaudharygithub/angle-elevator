/**
 * Google Apps Script Code for Angel Elevators Contact Form
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/14qFHLGFldraZM0MjXZhuzLMqP-PVMmjTsRdDaUng8xo/edit
 * 
 * 2. Go to Extensions > Apps Script
 * 
 * 3. Delete any existing code and paste the code below (starting from the doPost function)
 * 
 * 4. Update the SPREADSHEET_ID constant with your sheet ID: 14qFHLGFldraZM0MjXZhuzLMqP-PVMmjTsRdDaUng8xo
 * 
 * 5. Update the SHEET_NAME if your sheet tab has a different name (default is usually "Sheet1")
 * 
 * 6. Click "Save" (Ctrl+S or Cmd+S)
 * 
 * 7. Click "Deploy" > "New deployment"
 * 
 * 8. Click the gear icon (⚙️) next to "Select type" and choose "Web app"
 * 
 * 9. Set the following:
 *    - Description: "Contact Form Handler"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 
 * 10. Click "Deploy"
 * 
 * 11. Copy the "Web app URL" that appears
 * 
 * 12. Open script.js in your project and paste the URL into the GOOGLE_SCRIPT_URL constant
 *    (around line 1105, replace the empty string "")
 * 
 * 13. Test the form submission!
 * 
 * NOTE: If you make changes to the Apps Script code, you'll need to create a new deployment
 * version and update the URL in script.js
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    let data;
    try {
      if (e.postData && e.postData.contents) {
        data = JSON.parse(e.postData.contents);
      } else {
        throw new Error('No data received');
      }
    } catch (parseError) {
      Logger.log('Parse error: ' + parseError.toString());
      return createResponse({ success: false, error: 'Invalid JSON data' });
    }
    
    // Your Google Sheet ID (extract from the URL)
    const SPREADSHEET_ID = '14qFHLGFldraZM0MjXZhuzLMqP-PVMmjTsRdDaUng8xo';
    
    // Name of the sheet tab (usually "Sheet1", change if different)
    const SHEET_NAME = 'Sheet1';
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Check if headers exist, if not, add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Date',
        'Time',
        'Name',
        'Email',
        'Phone',
        'Project Type',
        'Notes'
      ]);
      
      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#7cffe1');
      headerRange.setFontColor('#01010a');
    }
    
    // Prepare the row data in the correct order
    const rowData = [
      data.date || '',
      data.time || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.projectType || '',
      data.notes || ''
    ];
    
    // Append the new row
    sheet.appendRow(rowData);
    
    // Optional: Format the new row
    const lastRow = sheet.getLastRow();
    const newRowRange = sheet.getRange(lastRow, 1, 1, 7);
    newRowRange.setBorder(true, true, true, true, true, true);
    
    // Return success response with CORS headers
    return createResponse({
      success: true,
      message: 'Data saved successfully'
    });
    
  } catch (error) {
    // Log the error for debugging
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // Return error response
    return createResponse({
      success: false,
      error: error.toString()
    });
  }
}

// Helper function to create response with proper CORS headers
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle OPTIONS request for CORS preflight
function doOptions() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - you can run this manually to test the script
 * Go to Run > Run function > testDoPost
 */
function testDoPost() {
  const testData = {
    date: '2025-01-15',
    time: '14:30:00',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+91 90000 00000',
    projectType: 'Luxury residence',
    notes: 'This is a test submission'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

