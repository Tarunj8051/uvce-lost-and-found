document.addEventListener('DOMContentLoaded', function() {
  // Image Preview Handler
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG)');
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

  // Form Submission Handler
  document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('statusMessage') || createStatusDiv();

    try {
      // Show loading state
      button.disabled = true;
      statusDiv.textContent = "Submitting...";
      statusDiv.className = "status processing";

      // Prepare form data
      const formData = {
        usn: form.usn.value,
        branch: form.branch.value,
        item: form.item.value,
        location: form.location.value,
        date: form.date.value,
        contact: form.contact.value,
        imageBase64: document.getElementById('imageBase64').value || ''
      };

      // Send to Google Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Submission failed");
      }

      // Success
      statusDiv.textContent = "Submitted successfully!";
      statusDiv.className = "status success";
      form.reset();
      preview.src = "";
      preview.style.display = "none";

    } catch (error) {
      console.error('Error:', error);
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.className = "status error";
    } finally {
      button.disabled = false;
    }
  });

  function createStatusDiv() {
    const div = document.createElement('div');
    div.id = 'statusMessage';
    form.appendChild(div);
    return div;
  }
});
