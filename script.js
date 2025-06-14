function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById("1y3LuRNV77H74uVAL-Z7H7rYC5yrAFu9r5xQslLIwKos").getSheetByName("Form Responses");
    const folder = DriveApp.getFolderById("1JK6cLiYmE7AZ0ezc0C_8Ddwn18X4i3Md");

    const data = JSON.parse(e.postData.contents);
    const blob = Utilities.base64Decode(data.imageBase64);
    const file = folder.createFile(blob, `found_item_${Date.now()}.png`, MimeType.PNG);
    const imageUrl = file.getUrl();

    sheet.appendRow([
      new Date(),
      data.usn,
      data.branch,
      data.item,
      data.location,
      data.date,
      data.contact,
      imageUrl
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// Add CORS preflight support
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
