document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase
  const supabaseUrl = 'https://iegpjpwlmyufhtbdjyzg.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZ3BqcHdsbXl1Zmh0YmRqeXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzMyODEsImV4cCI6MjA2NTUwOTI4MX0.46gZziNKQa5QCtE31BlMRFnJ3-oEvzPZIoEkHgrP6fo';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  const form = document.getElementById('reportForm');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const statusDiv = document.getElementById('status');

  // Image Preview Handler
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      showStatus('Please select an image file (JPEG/PNG)', 'error');
      imageInput.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showStatus('Image too large (max 5MB)', 'error');
      imageInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Form Submission Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    
    try {
      button.disabled = true;
      showStatus('Submitting...', 'processing');

      // 1. Upload image if exists
      let imageUrl = null;
      const file = imageInput.files[0];
      
      if (file) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('lost-found-images')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          imageUrl = `${supabaseUrl}/storage/v1/object/public/lost-found-images/${fileName}`;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          showStatus('Image upload failed, submitting without image', 'error');
        }
      }

      // 2. Save all data
      const { error } = await supabase
        .from('submissions')
        .insert([{
          usn: form.usn.value,
          branch: form.branch.value,
          item: form.item.value,
          location: form.location.value,
          date: form.date.value,
          contact: form.contact.value,
          image_url: imageUrl,
          status: 'new'
        }]);

      if (error) throw error;

      // Success
      showStatus('Submitted successfully!', 'success');
      form.reset();
      preview.style.display = 'none';

    } catch (error) {
      console.error('Submission error:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      button.disabled = false;
    }
  });

  function showStatus(message, type) {
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    if (type !== 'processing') {
      setTimeout(() => statusDiv.innerHTML = '', 5000);
    }
  }
});
