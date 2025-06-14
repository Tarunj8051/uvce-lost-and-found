document.getElementById('imageInput').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64 = e.target.result.split(',')[1];
      document.getElementById('imageBase64').value = base64;
      document.getElementById('preview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('reportForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  fetch("https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(result => {
      if (result.success) {
        alert("Submitted successfully!");
        form.reset();
        document.getElementById('preview').src = "";
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Submission failed: " + error.message);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Found Item";
    });
});
