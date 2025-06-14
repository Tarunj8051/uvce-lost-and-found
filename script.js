document.addEventListener('DOMContentLoaded', () => {
  // Image preview functionality
  document.getElementById('imageInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      document.getElementById('preview').src = URL.createObjectURL(file);
    } else {
      document.getElementById('preview').src = '';
    }
  });

  // Form submission handler
  document.getElementById('reportForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const usn = document.getElementById('usn').value.trim();
    const branch = document.getElementById('branch').value;
    const item = document.getElementById('item').value.trim();
    const location = document.getElementById('location').value.trim();
    const date = document.getElementById('date').value;
    const contact = document.getElementById('contact').value.trim();

    // For now, image upload is not handled (can be added later)
    const imageUrl = "";

    const data = {
      usn,
      branch,
      item,
      location,
      date,
      contact,
      imageUrl
    };

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzqZ9NnpWFLRAxqVlOQSrRoxHKrAch88BdI5bT4EkWCnriy0y1uc0_c23Hxd21JQlfG/exec';

    fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(res => {
        if (res.result === 'success') {
          alert('Item reported successfully!');
          this.reset();
          document.getElementById('preview').src = '';
        } else {
          alert('Error: ' + (res.message || 'Unknown error'));
        }
      })
      .catch(error => {
        alert('Error submitting form: ' + error.message);
      });
  });
});
