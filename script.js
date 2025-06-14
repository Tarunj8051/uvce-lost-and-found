document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button');
  
  try {
    // Show loading state
    button.disabled = true;
    button.textContent = "Submitting...";
    
    // Get form data
    const formData = {
      usn: form.usn.value,
      branch: form.branch.value,
      item: form.item.value,
      location: form.location.value,
      date: form.date.value,
      contact: form.contact.value,
      imageBase64: form.imageBase64.value
    };
    
    // Send to Google Apps Script
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    );
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Submission failed");
    }
    
    // Success!
    alert("Submitted successfully!");
    form.reset();
    document.getElementById('preview').src = "";
    
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = "Submit Found Item";
  }
});

// Image upload handler remains the same
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
