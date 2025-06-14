document.getElementById('reportForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusDiv = document.getElementById('statusMessage') || createStatusDiv();

  try {
    // Show loading state
    submitBtn.disabled = true;
    statusDiv.textContent = "Submitting...";
    statusDiv.className = "status processing";

    // Prepare form data
    const formData = new FormData(form);
    
    // Send to Google Apps Script
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Unknown server error");
    }

    // Success handling
    statusDiv.textContent = "Submitted successfully!";
    statusDiv.className = "status success";
    form.reset();
    document.getElementById('preview').src = "";

  } catch (error) {
    console.error("Submission error:", error);
    statusDiv.textContent = `Error: ${error.message}`;
    statusDiv.className = "status error";
    
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => statusDiv.textContent = '', 5000);
  }
});

function createStatusDiv() {
  const div = document.createElement('div');
  div.id = 'statusMessage';
  document.querySelector('main').appendChild(div);
  return div;
}
