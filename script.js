// script.js - Complete solution with error handling
document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  
  try {
    // 1. Disable button during submission
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Processing...';

    // 2. Prepare data
    const formData = {
      usn: form.usn.value,
      branch: form.branch.value,
      item: form.item.value,
      location: form.location.value,
      date: form.date.value,
      contact: form.contact.value,
      imageBase64: form.imageBase64.value || null
    };

    // 3. Send to Google Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    // 4. Handle response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    
    if (!result.success) throw new Error(result.error || "Unknown server error");

    // 5. Success
    showAlert('success', 'Submission successful!');
    form.reset();
    document.getElementById('preview').src = "";

  } catch (error) {
    console.error('Submission error:', error);
    showAlert('error', `Failed: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = 'Submit Found Item';
  }
});

// Image handler
document.getElementById('imageInput').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('preview').src = e.target.result;
    document.getElementById('imageBase64').value = e.target.result.split(',')[1];
  };
  reader.readAsDataURL(file);
});

// Alert helper
function showAlert(type, message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert ${type}`;
  alertDiv.textContent = message;
  document.body.prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}
