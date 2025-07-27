// Certificate View JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthStatus();
    
    // Get certificate ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const certificateId = urlParams.get('id');
    
    if (certificateId) {
        loadCertificate(certificateId);
    } else {
        showNotification('معرف الشهادة غير موجود', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
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

async function loadCertificate(certificateId) {
    try {
        const response = await fetch(`/api/certificates/${certificateId}/view`);
        const data = await response.json();
        
        if (data.success) {
            displayCertificate(data.data);
        } else {
            showNotification('فشل في تحميل بيانات الشهادة', 'error');
        }
    } catch (error) {
        console.error('Failed to load certificate:', error);
        showNotification('حدث خطأ في تحميل البيانات', 'error');
    }
}

function displayCertificate(certificate) {
    // Update certificate information
    document.getElementById('certificateName').textContent = certificate.name;
    document.getElementById('nationality').textContent = certificate.nationality;
    document.getElementById('idNumber').textContent = certificate.id_number;
    document.getElementById('profession').textContent = certificate.profession;
    document.getElementById('certificateNumber').textContent = certificate.certificate_number || certificate.id.toString().padStart(8, '0');
    
    // Medical certificate dates
    document.getElementById('medicalIssueDate').textContent = certificate.medical_certificate_issue_date || '-';
    document.getElementById('medicalExpiryDate').textContent = certificate.medical_certificate_expiry_date || '-';
    
    // Educational program information
    document.getElementById('programType').textContent = certificate.educational_program_type || 'برنامج التسجيل';
    document.getElementById('programExpiryDate').textContent = certificate.educational_program_expiry_date || '-';
    
    // Additional information
    document.getElementById('licenseNumber').textContent = certificate.license_number || '-';
    document.getElementById('establishmentName').textContent = certificate.establishment_name || '-';
    
    // Display QR code
    if (certificate.qr_code) {
        const qrCodeElement = document.getElementById('qrCode');
        qrCodeElement.innerHTML = `<img src="data:image/png;base64,${certificate.qr_code}" alt="QR Code">`;
    }
    
    // Display personal photo
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    if (certificate.personal_photo) {
        photoPlaceholder.innerHTML = `<img src="${certificate.personal_photo}" alt="صورة شخصية">`;
    } else {
        photoPlaceholder.innerHTML = `
            <input type="file" id="photoInput" accept="image/*" style="display: none;" onchange="handlePhotoUpload(event)">
            <div onclick="document.getElementById('photoInput').click()" style="cursor: pointer;">
                <span>اضغط لإضافة صورة</span>
            </div>
        `;
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoPlaceholder = document.getElementById('photoPlaceholder');
            photoPlaceholder.innerHTML = `<img src="${e.target.result}" alt="صورة شخصية">`;
        };
        reader.readAsDataURL(file);
    }
}

function printCertificate() {
    // Get certificate ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const certificateId = urlParams.get('id');
    
    if (!certificateId) {
        showNotification('معرف الشهادة غير موجود', 'error');
        return;
    }
    
    // Open print modal instead of new window
    openPrintModal();
}

// فتح النافذة المنبثقة للطباعة
function openPrintModal() {
    // إنشاء النافذة المنبثقة إذا لم تكن موجودة
    if (!document.getElementById('print-modal')) {
        createPrintModal();
    }
    
    document.getElementById('print-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// إنشاء النافذة المنبثقة للطباعة
function createPrintModal() {
    const modalHTML = `
        <div id="print-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>خيارات الطباعة</h2>
                    <span class="close" onclick="closePrintModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="print-options">
                        <div class="print-option" onclick="selectPrintOption('unified')">
                            <div class="option-icon">📄</div>
                            <div class="option-text">
                                <h3>شهادة موحدة</h3>
                                <p>طباعة الشهادة الصحية الموحدة الكاملة</p>
                            </div>
                        </div>
                        <div class="print-option" onclick="selectPrintOption('annual')">
                            <div class="option-icon">📅</div>
                            <div class="option-text">
                                <h3>شهادة سنوية</h3>
                                <p>طباعة الشهادة السنوية المبسطة</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="city-selection" class="city-selection" style="display: none;">
                        <h3>اختر المدينة</h3>
                        <div class="cities-grid">
                            <div class="city-option" onclick="selectCity('الرياض')">الرياض</div>
                            <div class="city-option" onclick="selectCity('جدة')">جدة</div>
                            <div class="city-option" onclick="selectCity('الدمام')">الدمام</div>
                            <div class="city-option" onclick="selectCity('مكة المكرمة')">مكة المكرمة</div>
                            <div class="city-option" onclick="selectCity('المدينة المنورة')">المدينة المنورة</div>
                            <div class="city-option" onclick="selectCity('الطائف')">الطائف</div>
                            <div class="city-option" onclick="selectCity('أبها')">أبها</div>
                            <div class="city-option" onclick="selectCity('تبوك')">تبوك</div>
                            <div class="city-option" onclick="selectCity('حائل')">حائل</div>
                            <div class="city-option" onclick="selectCity('أخرى')">أخرى</div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-primary" onclick="proceedToPrint()">طباعة الشهادة</button>
                            <button class="btn btn-secondary" onclick="closePrintModal()">إلغاء</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // إضافة CSS للنافذة المنبثقة
    addPrintModalCSS();
}

// إضافة CSS للنافذة المنبثقة
function addPrintModalCSS() {
    const style = document.createElement('style');
    style.textContent = `
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

        .modal-content {
            background-color: white;
            margin: 5% auto;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease;
        }

        .modal-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 20px 30px;
            border-radius: 15px 15px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 24px;
        }

        .close {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }

        .close:hover {
            color: #ddd;
        }

        .modal-body {
            padding: 30px;
        }

        .print-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        }

        .print-option {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .print-option:hover {
            border-color: #4CAF50;
            background-color: #f8f8f8;
            transform: translateY(-2px);
        }

        .option-icon {
            font-size: 40px;
            min-width: 60px;
            text-align: center;
        }

        .option-text h3 {
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .option-text p {
            color: #666;
            font-size: 14px;
        }

        .city-selection h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }

        .cities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin-bottom: 30px;
        }

        .city-option {
            padding: 15px;
            background: #f0f0f0;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .city-option:hover {
            background: #4CAF50;
            color: white;
            transform: translateY(-2px);
        }

        .city-option.selected {
            background: #4CAF50;
            color: white;
            border-color: #45a049;
        }

        .modal-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            min-width: 100px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #1976D2, #1565C0);
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #666, #555);
            color: white;
        }

        .btn-secondary:hover {
            background: linear-gradient(135deg, #555, #444);
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideDown {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 10% auto;
            }
            
            .cities-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
    document.head.appendChild(style);
}

// متغيرات للطباعة
let selectedPrintType = null;
let selectedCity = null;

// إغلاق النافذة المنبثقة
function closePrintModal() {
    document.getElementById('print-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
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
    
    // تنفيذ الطباعة
    window.print();
    
    showNotification('تم إرسال الشهادة للطباعة', 'success');
}

// إغلاق النافذة المنبثقة عند النقر خارجها
window.onclick = function(event) {
    const modal = document.getElementById('print-modal');
    if (event.target === modal) {
        closePrintModal();
    }
}

function goBack() {
    window.location.href = 'dashboard.html';
}

// Add CSS animations for notifications
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

