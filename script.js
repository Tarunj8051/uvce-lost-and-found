// Initialize Supabase
const supabaseUrl = 'https://iegpjpwlmyufhtbdjyzg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZ3BqcHdsbXl1Zmh0YmRqeXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzMyODEsImV4cCI6MjA2NTUwOTI4MX0.46gZziNKQa5QCtE31BlMRFnJ3-oEvzPZIoEkHgrP6fo';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Modified form submit handler
document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  
  try {
    button.disabled = true;
    button.textContent = 'Submitting...';

    // 1. Upload image if exists
    let imageUrl = null;
    const imageInput = document.getElementById('imageInput');
    
    if (imageInput.files[0]) {
      const file = imageInput.files[0];
      const fileName = `item_${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lost-found-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      imageUrl = `${supabaseUrl}/storage/v1/object/public/lost-found-images/${fileName}`;
    }

    // 2. Save all data
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        usn: form.usn.value,
        branch: form.branch.value,
        item: form.item.value,
        location: form.location.value,
        date: form.date.value,
        contact: form.contact.value,
        image_url: imageUrl
      }]);

    if (error) throw error;

    alert('Submitted successfully!');
    form.reset();
    document.getElementById('preview').src = '';

  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Submit Found Item';
  }
});

// Keep your existing image preview code
document.getElementById('imageInput').addEventListener('change', function() {
  // ... (your existing preview code)
});
