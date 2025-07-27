// API utility functions

const API_BASE = '/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Authentication API
const AuthAPI = {
    async login(email, password) {
        return apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    async logout() {
        return apiRequest('/logout', {
            method: 'POST'
        });
    },
    
    async checkAuth() {
        return apiRequest('/check-auth');
    }
};

// Certificates API
const CertificatesAPI = {
    async getAll() {
        return apiRequest('/certificates');
    },
    
    async create(certificateData) {
        return apiRequest('/certificates', {
            method: 'POST',
            body: JSON.stringify(certificateData)
        });
    },
    
    async getById(id) {
        return apiRequest(`/certificates/${id}`);
    },
    
    async update(id, certificateData) {
        return apiRequest(`/certificates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(certificateData)
        });
    },
    
    async delete(id) {
        return apiRequest(`/certificates/${id}`, {
            method: 'DELETE'
        });
    },
    
    async search(query) {
        return apiRequest(`/certificates/search?q=${encodeURIComponent(query)}`);
    }
};

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        ${type === 'success' ? 'background-color: #27ae60;' : 
          type === 'error' ? 'background-color: #e74c3c;' : 
          'background-color: #3498db;'}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export for use in other files
window.AuthAPI = AuthAPI;
window.CertificatesAPI = CertificatesAPI;
window.showNotification = showNotification;

