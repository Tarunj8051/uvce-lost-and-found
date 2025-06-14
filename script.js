document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  
  try {
    button.disabled = true;
    button.innerHTML = 'Submitting...';

    const formData = {
      usn: form.usn.value,
      branch: form.branch.value,
      item: form.item.value,
      location: form.location.value,
      date: form.date.value,
      contact: form.contact.value,
      imageBase64: form.imageBase64.value || null
    };

    // Updated fetch call with CORS handling
    const response = await fetch('https://script.google.com/your-script-url', {
      method: 'POST',
      mode: 'no-cors', // Critical CORS fix
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error || "Submission failed");
    
    alert('Submitted successfully!');
    form.reset();
    document.getElementById('preview').src = "";

  } catch (error) {
    console.error('Error:', error);
    alert(`Submission failed: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = 'Submit Found Item';
  }
});
