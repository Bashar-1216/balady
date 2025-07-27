
let currentCertificateId = null;
let selectedPrintType = null;
let selectedCity = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Certificate details page loaded');
    
    // Get certificate ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCertificateId = urlParams.get('id');
    
    console.log('Certificate ID from URL:', currentCertificateId);
    
    if (currentCertificateId) {
        loadCertificateDetails(currentCertificateId);
    } else {
        console.error('No certificate ID found in URL');
        showNotification('معرف الشهادة غير موجود', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
});

async function loadCertificateDetails(certificateId) {
    try {
        console.log('Loading certificate details for ID:', certificateId);
        
        const response = await fetch(`/api/certificates/${certificateId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data) {
            const certificate = result.data;
            console.log('Certificate data received:', certificate);
            displayCertificateDetails(certificate);
        } else {
            console.error('API returned error or no data:', result);
            showNotification('خطأ في تحميل بيانات الشهادة', 'error');
        }
    } catch (error) {
        console.error('Error loading certificate details:', error);
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

function displayCertificateDetails(certificate) {
    console.log('Displaying certificate details:', certificate);
    
    // Update page title with person's name
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = certificate.name || 'عبد السلام يحيى يحيى...';
    }
    
    // Update profile image
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        if (certificate.personal_photo) {
            profileImage.src = certificate.personal_photo;
            profileImage.onerror = function() {
                this.src = 'https://via.placeholder.com/120x150?text=صورة';
            };
        } else {
            profileImage.src = 'https://via.placeholder.com/120x150?text=صورة';
        }
    }
    
    // Update full name in the certificate
    const fullNameElement = document.getElementById('full-name');
    if (fullNameElement) {
        fullNameElement.textContent = certificate.name || 'غير محدد';
    }
    
    // Update all detail fields with proper mapping
    const fieldMappings = {
        // Right column
        'identity-number': certificate.id_number,
        'certificate-number': certificate.certificate_number,
        'medical-issue-date': certificate.medical_certificate_issue_date,
        'educational-program-type': certificate.educational_program_type,
        
        // Left column
        'nationality': certificate.nationality,
        'age': '35', // This would need to be calculated from birth date if available
        'profession': certificate.profession,
        'medical-expiry-date': certificate.medical_certificate_expiry_date,
        'educational-expiry-date': certificate.educational_program_expiry_date
    };
    
    // Update each field
    Object.keys(fieldMappings).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const value = fieldMappings[fieldId] || 'غير محدد';
            element.textContent = value;
            console.log(`Updated field ${fieldId} with value:`, value);
        } else {
            console.warn(`Element with ID ${fieldId} not found`);
        }
    });
    
    console.log('Certificate details display completed');
}

function editCertificate() {
    if (currentCertificateId) {
        console.log('Navigating to edit page for certificate:', currentCertificateId);
        window.location.href = `add-certificate.html?id=${currentCertificateId}&mode=edit`;
    } else {
        console.error('No certificate ID available for editing');
        showNotification('معرف الشهادة غير متوفر', 'error');
    }
}

function printCertificate() {
    console.log('Print certificate button clicked');
    // Show print modal
    const printModal = document.getElementById('print-modal');
    if (printModal) {
        printModal.style.display = 'block';
    }
}

function closePrintModal() {
    const printModal = document.getElementById('print-modal');
    if (printModal) {
        printModal.style.display = 'none';
    }
    
    const citySelection = document.getElementById('city-selection');
    if (citySelection) {
        citySelection.style.display = 'none';
    }
    
    selectedPrintType = null;
    selectedCity = null;
}

function selectPrintOption(type) {
    selectedPrintType = type;
    console.log('Selected print type:', type);
    
    // Hide print options and show city selection
    const printOptions = document.querySelector('.print-options');
    if (printOptions) {
        printOptions.style.display = 'none';
    }
    
    const citySelection = document.getElementById('city-selection');
    if (citySelection) {
        citySelection.style.display = 'block';
    }
}

function selectCity(city) {
    selectedCity = city;
    console.log('Selected city:', city);
    
    // Highlight selected city
    document.querySelectorAll('.city-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    if (event && event.target) {
        event.target.classList.add('selected');
    }
}

function proceedToPrint() {
    if (!selectedPrintType || !selectedCity) {
        showNotification('يرجى اختيار نوع الطباعة والمدينة', 'error');
        return;
    }
    
    console.log('Proceeding to print with type:', selectedPrintType, 'and city:', selectedCity);
    
    // Close modal
    closePrintModal();
    
    // Navigate to certificate view page with print parameters
    const params = new URLSearchParams({
        id: currentCertificateId,
        type: selectedPrintType,
        city: selectedCity
    });
    
    window.location.href = `certificate-view.html?${params.toString()}`;
}

function goBack() {
    console.log('Going back to dashboard');
    window.location.href = 'dashboard.html';
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // تنسيق الإشعار
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // تحديد لون الإشعار حسب النوع
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'info':
            notification.style.backgroundColor = '#2196F3';
            break;
        default:
            notification.style.backgroundColor = '#666';
    }
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// إضافة CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .city-option.selected {
        background-color: #4CAF50 !important;
        color: white !important;
        transform: scale(1.05);
    }
    
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.editCertificate = editCertificate;
window.printCertificate = printCertificate;
window.goBack = goBack;
window.closePrintModal = closePrintModal;
window.selectPrintOption = selectPrintOption;
window.selectCity = selectCity;
window.proceedToPrint = proceedToPrint;

console.log('Certificate details JavaScript loaded successfully');

