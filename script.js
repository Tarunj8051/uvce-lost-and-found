document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const imageBase64Input = document.getElementById("imageBase64");

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const base64String = e.target.result;
      preview.src = base64String;
      // Remove the data:image/...;base64, part to only store the raw base64
      const base64Raw = base64String.split(",")[1];
      imageBase64Input.value = base64Raw;
    };

    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const statusDiv = document.getElementById("status");
    statusDiv.textContent = "Submitting...";

    const payload = {
      usn: form.usn.value,
      branch: form.branch.value,
      item: form.item.value,
      location: form.location.value,
      date: form.date.value,
      contact: form.contact.value,
      imageBase64: imageBase64Input.value,
      imageType: imageInput.files[0]?.type || "image/png"
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      if (result.success) {
        statusDiv.textContent = "✅ Submission successful!";
        form.reset();
        preview.src = "";
        imageBase64Input.value = "";
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      statusDiv.textContent = "❌ Submission failed: " + err.message;
    }
  });
});
