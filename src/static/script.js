// Main login page functionality

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('.login-button');
    const rememberCheckbox = document.querySelector('#remember');

    // Check if user is already authenticated
    checkAuthStatus();

    // Add form validation
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Add enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // Add input validation on blur
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });

    async function checkAuthStatus() {
        try {
            const response = await AuthAPI.checkAuth();
            if (response.success && response.authenticated) {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    async function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        // Show loading state
        loginButton.textContent = 'جاري تسجيل الدخول...';
        loginButton.disabled = true;
        
        try {
            const response = await AuthAPI.login(email, password);
            
            if (response.success) {
                showNotification('تم تسجيل الدخول بنجاح!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showNotification(response.message || 'فشل في تسجيل الدخول', 'error');
            }
        } catch (error) {
            showNotification('حدث خطأ في الاتصال', 'error');
            console.error('Login error:', error);
        } finally {
            loginButton.textContent = 'تسجيل الدخول';
            loginButton.disabled = false;
        }
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

