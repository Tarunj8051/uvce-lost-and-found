document.addEventListener('DOMContentLoaded', function() {
  // Image Preview Handler
  document.getElementById('imageInput').addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    
    // Validate image
    if (!file.type.startsWith('image/')) {
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
      document.getElementById('preview').src = e.target.result;
      document.getElementById('imageBase64').value = e.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  });

  // Form Submission Handler
  document.getElementById('reportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    
    try {
      // Show loading state
      button.disabled = true;
      button.innerHTML = '<span class="spinner"></span> Submitting...';

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Submission failed");

      // Success
      showAlert('success', 'Item submitted successfully!');
      form.reset();
      document.getElementById('preview').src = '';

    } catch (error) {
      console.error('Submission error:', error);
      showAlert('error', `Submission failed: ${error.message}`);
    } finally {
      button.disabled = false;
      button.textContent = 'Submit Found Item';
    }
  });

  // Alert helper function
  function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
  }
});
