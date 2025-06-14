// Enhanced form handling with status indicators
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reportForm');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const statusDiv = document.createElement('div');
  statusDiv.className = 'status-message';
  form.appendChild(statusDiv);

  // Image preview handler
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showStatus('Image too large (max 5MB)', 'error');
      this.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      document.getElementById('imageBase64').value = e.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  });

  // Form submission handler
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    
    try {
      submitBtn.disabled = true;
      showStatus('Submitting...', 'processing');
      
      const formData = new FormData(form);
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", 
        {
          method: "POST",
          body: formData
        }
      );
      
      if (!response.ok) throw new Error('Network error');
      
      const result = await response.json();
      
      if (result.success) {
        showStatus('Submission successful!', 'success');
        form.reset();
        preview.src = "";
        
        // Optional: Show submission details
        console.log('Submission details:', result.data);
      } else {
        throw new Error(result.error || "Unknown server error");
      }
    } catch (error) {
      console.error('Submission error:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    
    if (type !== 'processing') {
      setTimeout(() => statusDiv.textContent = '', 5000);
    }
  }
});
