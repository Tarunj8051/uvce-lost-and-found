document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reportForm');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');

  // Image handler
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG)');
      this.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large (max 5MB)');
      this.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('imageBase64').value = e.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('status') || createStatusDiv();

    try {
      button.disabled = true;
      statusDiv.textContent = "Submitting...";
      statusDiv.className = "status processing";

      // Prepare data
      const formData = {
        usn: form.usn.value,
        branch: form.branch.value,
        item: form.item.value,
        location: form.location.value,
        date: form.date.value,
        contact: form.contact.value,
        imageBase64: document.getElementById('imageBase64').value,
        imageType: imageInput.files[0]?.type || "image/png"
      };

      // Send to Google Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Submission failed");

      statusDiv.innerHTML = `
        Success! <br>
        <a href="${result.spreadsheetUrl}" target="_blank">View Spreadsheet</a> | 
        <a href="${result.folderUrl}" target="_blank">View Images</a>
      `;
      statusDiv.className = "status success";
      form.reset();
      preview.style.display = 'none';

    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.className = "status error";
      console.error("Submission error:", error);
    } finally {
      button.disabled = false;
    }
  });

  function createStatusDiv() {
    const div = document.createElement('div');
    div.id = 'status';
    form.appendChild(div);
    return div;
  }
});
