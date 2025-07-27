// --- متغيرات عامة ---
let currentCertificateId = null;
let selectedPrintType = null;
let selectedCity = null;

// --- عند تحميل الصفحة ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentCertificateId = urlParams.get('id');

    if (!currentCertificateId) {
        showNotification('معرف الشهادة غير موجود', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }

    loadCertificateDetails(currentCertificateId);
});

// --- استدعاء API وجلب البيانات ---
async function loadCertificateDetails(id) {
    try {
        const res = await fetch(`/api/certificates/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
            displayCertificateDetails(json.data);
        } else {
            showNotification('خطأ في تحميل البيانات', 'error');
        }
    } catch (err) {
        console.error(err);
        showNotification('خطأ في الاتصال بالخادم', 'error');
    }
}

// --- عرض البيانات في الواجهة ---
function displayCertificateDetails(cert) {
    // الصورة
    const img = document.getElementById('profile-image');
    img.src = cert.personal_photo || 'https://via.placeholder.com/120x150?text=صورة';

    // رقم الشهادة
    document.getElementById('certificate-number').textContent = cert.certificate_number || '--';
    document.getElementById('certificate_number_detail').textContent = cert.certificate_number || '--';

    // ملء باقي الحقول
    const map = {
        amanah: cert.amanah || '--',
        municipality: cert.municipality || '--',
        name: cert.name || '--',
        identity_number: cert.id_number || '--',
        nationality: cert.nationality || '--',
        gender: cert.gender || '--',
        profession: cert.profession || '--',
        medical_certificate_issue_date: cert.medical_certificate_issue_date || '--',
        medical_certificate_expiry_date: cert.medical_certificate_expiry_date || '--',
        educational_program_type: cert.educational_program_type || '--',
        educational_program_expiry_date: cert.educational_program_expiry_date || '--',
        license_number: cert.license_number || '--',
        establishment_name: cert.establishment_name || '--'
    };

    Object.keys(map).forEach(k => {
        const el = document.getElementById(k);
        if (el) el.textContent = map[k];
    });

    // اسم الصفحة
    document.getElementById('certificate-name').textContent = cert.name || '--';
}

// --- وظائف الطباعة والتعديل ---
function editCertificate() {
    if (currentCertificateId)
        window.location.href = `add-certificate.html?id=${currentCertificateId}&mode=edit`;
}

function printCertificate() {
    document.getElementById('print-modal').style.display = 'block';
}

function closePrintModal() {
    document.getElementById('print-modal').style.display = 'none';
    document.getElementById('city-selection').style.display = 'none';
    selectedPrintType = selectedCity = null;
    document.querySelectorAll('.city-option').forEach(o => o.classList.remove('selected'));
}

function selectPrintOption(type) {
    selectedPrintType = type;
    document.querySelector('.print-options').style.display = 'none';
    document.getElementById('city-selection').style.display = 'block';
}

function selectCity(city) {
    selectedCity = city;
    document.querySelectorAll('.city-option').forEach(o => o.classList.remove('selected'));
    event.target.classList.add('selected');
}

function proceedToPrint() {
    if (!selectedPrintType || !selectedCity) {
        showNotification('يرجى اختيار نوع الطباعة والمدينة', 'error');
        return;
    }
    closePrintModal();
    const params = new URLSearchParams({ id: currentCertificateId, type: selectedPrintType, city: selectedCity });
    window.location.href = `certificate-view.html?${params.toString()}`;
}

function goBack() {
    history.back();
}

// --- إشعارات ---
function showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    n.style.cssText = `
        position:fixed;top:20px;right:20px;padding:15px 20px;border-radius:8px;color:#fff;font-weight:bold;z-index:1000;
        background:${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}
