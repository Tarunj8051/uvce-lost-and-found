
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reportForm');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  
  // Image Preview Handler
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;
    
    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed (JPEG/PNG)');
      imageInput.value = '';
      return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('imageBase64').value = e.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('status') || createStatusDiv();

    try {
      // Disable button during submission
      button.disabled = true;
      statusDiv.innerHTML = '<div class="status processing">Creating system and storing data...</div>';

      // Prepare payload
      const payload = {
        usn: form.usn.value || "Unknown",
        branch: form.branch.value || "Unknown",
        item: form.item.value || "Unspecified item",
        location: form.location.value || "Unknown location",
        date: form.date.value || new Date().toISOString().split('T')[0],
        contact: form.contact.value || "No contact",
        imageBase64: document.getElementById('imageBase64').value || null,
        imageType: imageInput.files[0]?.type || "image/png"
      };

      // Send to Google Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(Server returned ${response.status});
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Storage failed");

      // Success message with resource links
      statusDiv.innerHTML = 
        <div class="status success">
          <p>✅ System initialized successfully!</p>
          <p>Data stored in row ${result.resources.row}</p>
          <p>
            <a href="${result.resources.spreadsheet}" target="_blank">View Spreadsheet</a> | 
            <a href="${result.resources.folder}" target="_blank">View Images</a>
          </p>
        </div>
      ;

      // Reset form
      form.reset();
      preview.style.display = 'none';

    } catch (error) {
      statusDiv.innerHTML = 
        <div class="status error">
          ❌ Error: ${error.message}
        </div>
      ;
      console.error("Submission error:", error);
    } finally {
      button.disabled = false;
    }
  });

  function createStatusDiv() {
    const div = document.createElement('div');
    div.id = 'status';
    form.parentNode.insertBefore(div, form.nextSibling);
    return div;
  }
});
