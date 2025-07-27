// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadCertificates();
    
    // ربط الأزرار بالوظائف
    document.querySelector('.add-certificate-btn').addEventListener('click', function() {
        window.location.href = 'add-certificate.html';
    });
    
    document.querySelector('.search-btn').addEventListener('click', function() {
        searchCertificates();
    });
});

// تحميل الشهادات من الخادم
async function loadCertificates() {
    try {
        const response = await fetch('/api/certificates');
        const data = await response.json();
        
        // التحقق من هيكل البيانات المستلمة
        if (data.success && data.data) {
            displayCertificatesInTable(data.data);
        } else if (Array.isArray(data)) {
            // في حالة كانت البيانات مصفوفة مباشرة
            displayCertificatesInTable(data);
        } else {
            console.error('هيكل البيانات غير متوقع:', data);
            showNotification('خطأ في تحميل البيانات', 'error');
        }
    } catch (error) {
        console.error('خطأ في تحميل الشهادات:', error);
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

// عرض الشهادات في الجدول
function displayCertificatesInTable(certificates) {
    const tbody = document.getElementById('certificates-tbody');
    tbody.innerHTML = '';
    
    if (!certificates || certificates.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                    لا توجد شهادات مسجلة
                </td>
            </tr>
        `;
        return;
    }
    
    certificates.forEach(certificate => {
        const row = document.createElement('tr');
        
        // تحديد مصدر الصورة الشخصية
        let photoSrc = 'https://via.placeholder.com/60x60?text=صورة';
        if (certificate.personal_photo) {
            // إذا كانت الصورة base64
            if (certificate.personal_photo.startsWith('data:image')) {
                photoSrc = certificate.personal_photo;
            } else {
                // إذا كانت رابط عادي
                photoSrc = certificate.personal_photo;
            }
        }
        
        row.innerHTML = `
            <td>${certificate.id}</td>
            <td>${certificate.name || 'غير محدد'}</td>
            <td>
                <img src="${photoSrc}" 
                     alt="صورة شخصية" 
                     class="profile-image-table"
                     onerror="this.src='https://via.placeholder.com/60x60?text=صورة'">
            </td>
            <td>
                <div class="action-buttons-group">
                    <button class="action-btn details" onclick="viewDetails(${certificate.id})">تفاصيل</button>
                    <button class="action-btn edit" onclick="editCertificate(${certificate.id})">تعديل</button>
                    <button class="action-btn delete" onclick="deleteCertificate(${certificate.id})">حذف</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// عرض تفاصيل الشهادة
function viewDetails(certificateId) {
    window.location.href = `certificate-details.html?id=${certificateId}`;
}

// تعديل الشهادة
function editCertificate(certificateId) {
    window.location.href = `add-certificate.html?id=${certificateId}&mode=edit`;
}

// حذف الشهادة
async function deleteCertificate(certificateId) {
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/certificates/${certificateId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('تم حذف الشهادة بنجاح', 'success');
            loadCertificates(); // إعادة تحميل القائمة
        } else {
            throw new Error('فشل في حذف الشهادة');
        }
    } catch (error) {
        console.error('خطأ في حذف الشهادة:', error);
        showNotification('خطأ في حذف الشهادة', 'error');
    }
}

// البحث في الشهادات
async function searchCertificates() {
    const searchTerm = prompt('أدخل اسم الشخص للبحث:');
    if (!searchTerm) return;
    
    try {
        const response = await fetch(`/api/certificates/search?name=${encodeURIComponent(searchTerm)}`);
        const certificates = await response.json();
        
        displayCertificatesInTable(certificates);
        
        if (certificates.length === 0) {
            showNotification('لم يتم العثور على نتائج', 'info');
        }
    } catch (error) {
        console.error('خطأ في البحث:', error);
        showNotification('خطأ في البحث', 'error');
    }
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
        z-index: 1000;
        animation: slideIn 0.3s ease;
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
            document.body.removeChild(notification);
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
`;
document.head.appendChild(style);

