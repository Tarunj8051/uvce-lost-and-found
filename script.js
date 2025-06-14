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
  const data = new FormData(form);
  const formObject = {};
  data.forEach((value, key) => formObject[key] = value);

  fetch("https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formObject)
  })
    .then(response => response.json())
    .then(res => {
      if (res.success) {
        alert("Submitted successfully!");
        form.reset();
        document.getElementById('preview').src = "";
      } else {
        alert("Submission failed: " + res.error);
      }
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    });
});
