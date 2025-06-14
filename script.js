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

  const formData = new URLSearchParams();
  formData.append("usn", document.getElementById("usn").value);
  formData.append("branch", document.getElementById("branch").value);
  formData.append("item", document.getElementById("item").value);
  formData.append("location", document.getElementById("location").value);
  formData.append("date", document.getElementById("date").value);
  formData.append("contact", document.getElementById("contact").value);
  formData.append("imageBase64", document.getElementById("imageBase64").value);
  formData.append("imageType", "image/png");

  fetch("https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Submitted successfully!");
        document.getElementById('reportForm').reset();
        document.getElementById('preview').src = "";
      } else {
        alert("Submission failed: " + data.error);
      }
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    });
});
