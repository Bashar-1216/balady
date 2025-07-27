// متغيرات عامة
let currentCertificateId = null;
let selectedPrintType = null;
let selectedCity = null;

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على معرف الشهادة من URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCertificateId = urlParams.get('id');
    
    if (currentCertificateId) {
        loadCertificateDetails(currentCertificateId);
    } else {
        showNotification('معرف الشهادة غير صحيح', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
});

// تحميل تفاصيل الشهادة من الخادم
async function loadCertificateDetails(certificateId) {
    try {
        const response = await fetch(`/api/certificates/${certificateId}`);
        
        if (!response.ok) {
            throw new Error('فشل في تحميل بيانات الشهادة');
        }
        
        const certificate = await response.json();
        displayCertificateDetails(certificate);
    } catch (error) {
        console.error('خطأ في تحميل تفاصيل الشهادة:', error);
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

// عرض تفاصيل الشهادة في الصفحة
function displayCertificateDetails(certificate) {
    // تحديث الصورة الشخصية والمعلومات الأساسية
    document.getElementById('profile-image').src = certificate.photo_url || 'https://via.placeholder.com/150x150?text=صورة';
    document.getElementById('certificate-name').textContent = certificate.name || 'غير محدد';
    document.getElementById('certificate-number').textContent = certificate.certificate_number || 'غير محدد';
    
    // تحديث البيانات الأساسية
    document.getElementById('amanah').textContent = certificate.amanah || 'غير محدد';
    document.getElementById('municipality').textContent = certificate.municipality || 'غير محدد';
    document.getElementById('name').textContent = certificate.name || 'غير محدد';
    document.getElementById('identity_number').textContent = certificate.identity_number || 'غير محدد';
    document.getElementById('nationality').textContent = certificate.nationality || 'غير محدد';
    document.getElementById('gender').textContent = certificate.gender || 'غير محدد';
    document.getElementById('profession').textContent = certificate.profession || 'غير محدد';
    
    // تحديث بيانات الشهادة الطبية
    document.getElementById('medical_certificate_issue_date').textContent = 
        formatDate(certificate.medical_certificate_issue_date) || 'غير محدد';
    document.getElementById('medical_certificate_expiry_date').textContent = 
        formatDate(certificate.medical_certificate_expiry_date) || 'غير محدد';
    
    // تحديث بيانات البرنامج التثقيفي
    document.getElementById('educational_program_type').textContent = 
        certificate.educational_program_type || 'غير محدد';
    document.getElementById('educational_program_expiry_date').textContent = 
        formatDate(certificate.educational_program_expiry_date) || 'غير محدد';
    
    // تحديث المعلومات الإضافية
    document.getElementById('license_number').textContent = certificate.license_number || 'غير محدد';
    document.getElementById('establishment_name').textContent = certificate.establishment_name || 'غير محدد';
    document.getElementById('certificate_number_detail').textContent = certificate.certificate_number || 'غير محدد';
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA');
    } catch (error) {
        return dateString;
    }
}

// تعديل الشهادة
function editCertificate() {
    if (currentCertificateId) {
        window.location.href = `add-certificate.html?id=${currentCertificateId}&mode=edit`;
    }
}

// طباعة الشهادة - فتح النافذة المنبثقة
function printCertificate() {
    document.getElementById('print-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
}

// إغلاق النافذة المنبثقة
function closePrintModal() {
    document.getElementById('print-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // إعادة تفعيل التمرير
    
    // إعادة تعيين الخيارات
    selectedPrintType = null;
    selectedCity = null;
    document.getElementById('city-selection').style.display = 'none';
    
    // إزالة التحديد من المدن
    document.querySelectorAll('.city-option').forEach(option => {
        option.classList.remove('selected');
    });
}

// اختيار نوع الطباعة
function selectPrintOption(type) {
    selectedPrintType = type;
    document.getElementById('city-selection').style.display = 'block';
    
    // تمرير سلس إلى قسم اختيار المدينة
    document.getElementById('city-selection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// اختيار المدينة
function selectCity(city) {
    selectedCity = city;
    
    // إزالة التحديد من جميع المدن
    document.querySelectorAll('.city-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // إضافة التحديد للمدينة المختارة
    event.target.classList.add('selected');
}

// المتابعة للطباعة
function proceedToPrint() {
    if (!selectedPrintType || !selectedCity) {
        showNotification('يرجى اختيار نوع الطباعة والمدينة', 'error');
        return;
    }
    
    // إغلاق النافذة المنبثقة
    closePrintModal();
    
    // توجيه إلى صفحة عرض الشهادة للطباعة
    const printUrl = `certificate-view.html?id=${currentCertificateId}&type=${selectedPrintType}&city=${encodeURIComponent(selectedCity)}`;
    window.open(printUrl, '_blank');
    
    showNotification('تم فتح صفحة الطباعة في نافذة جديدة', 'success');
}

// العودة إلى لوحة التحكم
function goBack() {
    window.location.href = 'dashboard.html';
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
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
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
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

// إغلاق النافذة المنبثقة عند النقر خارجها
window.onclick = function(event) {
    const modal = document.getElementById('print-modal');
    if (event.target === modal) {
        closePrintModal();
    }
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
`;
document.head.appendChild(style);

