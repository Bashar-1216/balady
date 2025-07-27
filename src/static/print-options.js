// Print Options JavaScript functionality

let selectedPrintType = null;
let selectedCity = null;
let certificateId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get certificate ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    certificateId = urlParams.get('id');
    
    if (!certificateId) {
        alert('معرف الشهادة غير موجود');
        window.history.back();
    }
});

function selectPrintOption(type) {
    selectedPrintType = type;
    
    // Show city selection
    const citySelection = document.getElementById('citySelection');
    citySelection.style.display = 'block';
    
    // Scroll to city selection
    citySelection.scrollIntoView({ behavior: 'smooth' });
}

function selectCity(city) {
    selectedCity = city;
    
    // Remove previous selection
    document.querySelectorAll('.city-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked city
    event.target.closest('.city-option').classList.add('selected');
    
    // Show print actions
    const printActions = document.getElementById('printActions');
    printActions.style.display = 'block';
    
    // Scroll to print actions
    printActions.scrollIntoView({ behavior: 'smooth' });
}

function proceedToPrint() {
    if (!selectedPrintType || !selectedCity) {
        alert('يرجى اختيار نوع الطباعة والمدينة');
        return;
    }
    
    // Construct the print URL with parameters
    const printUrl = `certificate-view.html?id=${certificateId}&print=${selectedPrintType}&city=${selectedCity}`;
    
    // Open in new window for printing
    const printWindow = window.open(printUrl, '_blank');
    
    // Auto-print after page loads
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 1000);
    };
    
    // Close this modal
    closePrintOptions();
}

function goBack() {
    // Go back to previous page
    window.history.back();
}

function closePrintOptions() {
    // Close this window or go back
    if (window.opener) {
        window.close();
    } else {
        window.history.back();
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePrintOptions();
    }
});

