// Add Certificate JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthStatus();
    
    // Setup photo preview
    setupPhotoPreview();
    
    // Setup form submission
    setupFormSubmission();
});

async function checkAuthStatus() {
    try {
        const response = await AuthAPI.checkAuth();
        if (!response.success || !response.authenticated) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'index.html';
    }
}

function setupPhotoPreview() {
    const photoInput = document.getElementById('personal_photo');
    const photoPreview = document.getElementById('photoPreview');
    
    photoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="صورة شخصية">`;
            };
            reader.readAsDataURL(file);
        } else {
            photoPreview.innerHTML = '<span>لم يتم اختيار صورة</span>';
        }
    });
}

function setupFormSubmission() {
    const form = document.getElementById('certificateForm');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(form);
            const data = {};
            
            // Get basic form data
            for (let [key, value] of formData.entries()) {
                if (key !== 'personal_photo') {
                    data[key] = value;
                }
            }
            
            // Handle photo upload
            const photoFile = formData.get('personal_photo');
            if (photoFile && photoFile.size > 0) {
                const photoBase64 = await fileToBase64(photoFile);
                data.personal_photo = photoBase64;
            }
            
            // Submit the form
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('تم إنشاء الشهادة بنجاح', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                showNotification(result.message || 'حدث خطأ في إنشاء الشهادة', 'error');
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('حدث خطأ في إرسال البيانات', 'error');
        }
    });
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function goBack() {
    window.location.href = 'dashboard.html';
}

