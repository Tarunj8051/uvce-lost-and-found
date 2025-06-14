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
  const data = {
    usn: form.usn.value,
    branch: form.branch.value,
    item: form.item.value,
    location: form.location.value,
    date: form.date.value,
    contact: form.contact.value,
    imageBase64: form.imageBase64.value,
    imageType: 'image/png'
  };

  fetch("https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(data).toString()
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert("Submitted successfully!");
        form.reset();
        document.getElementById('preview').src = "";
      } else {
        console.error("Script error:", result.error);
        alert("Submission failed. Check console for error.");
      }
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    });
});
