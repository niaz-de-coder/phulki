// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('certificateForm');
    const participantNameInput = document.getElementById('participantName');
    const certificateNumberInput = document.getElementById('certificateNumber');
    const trainingStartDateInput = document.getElementById('trainingStartDate');
    const trainingEndDateInput = document.getElementById('trainingEndDate');
    const termsCheckbox = document.getElementById('termsAgreement');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const certNumberError = document.getElementById('certNumberError');
    const startDateError = document.getElementById('startDateError');
    const endDateError = document.getElementById('endDateError');
    const termsError = document.getElementById('termsError');
    
    // Preview elements
    const previewName = document.getElementById('previewName');
    const previewCertNumber = document.getElementById('previewCertNumber');
    const previewStartDate = document.getElementById('previewStartDate');
    const previewEndDate = document.getElementById('previewEndDate');
    const previewIssueDate = document.getElementById('previewIssueDate');
    
    // Notification and loading overlay
    const notification = document.getElementById('notification');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Set today's date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    trainingStartDateInput.value = today;
    trainingEndDateInput.min = today;
    
    // Update end date min when start date changes
    trainingStartDateInput.addEventListener('change', function() {
        trainingEndDateInput.min = this.value;
        if (trainingEndDateInput.value && trainingEndDateInput.value < this.value) {
            trainingEndDateInput.value = this.value;
        }
        updatePreview();
    });
    
    // Update preview when form values change
    participantNameInput.addEventListener('input', updatePreview);
    certificateNumberInput.addEventListener('input', updatePreview);
    trainingStartDateInput.addEventListener('change', updatePreview);
    trainingEndDateInput.addEventListener('change', updatePreview);
    
    // Initialize preview with today's date
    previewIssueDate.textContent = formatDate(new Date());
    updatePreview();
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Reset error messages
        nameError.textContent = '';
        certNumberError.textContent = '';
        startDateError.textContent = '';
        endDateError.textContent = '';
        termsError.textContent = '';
        
        // Validate participant name
        if (!participantNameInput.value.trim()) {
            nameError.textContent = 'Participant name is required';
            isValid = false;
        } else if (participantNameInput.value.trim().length < 3) {
            nameError.textContent = 'Name must be at least 3 characters';
            isValid = false;
        }
        
        // Validate certificate number
        if (!certificateNumberInput.value.trim()) {
            certNumberError.textContent = 'Certificate number is required';
            isValid = false;
        } else if (!/^[A-Za-z0-9-]+$/.test(certificateNumberInput.value.trim())) {
            certNumberError.textContent = 'Only letters, numbers, and hyphens allowed';
            isValid = false;
        }
        
        // Validate start date
        if (!trainingStartDateInput.value) {
            startDateError.textContent = 'Start date is required';
            isValid = false;
        }
        
        // Validate end date
        if (!trainingEndDateInput.value) {
            endDateError.textContent = 'End date is required';
            isValid = false;
        } else if (trainingStartDateInput.value && trainingEndDateInput.value < trainingStartDateInput.value) {
            endDateError.textContent = 'End date must be after start date';
            isValid = false;
        }
        
        // Validate terms agreement
        if (!termsCheckbox.checked) {
            termsError.textContent = 'You must agree to the terms';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Update preview function
    function updatePreview() {
        previewName.textContent = participantNameInput.value.trim() || '[Participant Name]';
        previewCertNumber.textContent = certificateNumberInput.value.trim() || '[Certificate Number]';
        
        if (trainingStartDateInput.value) {
            previewStartDate.textContent = formatDate(new Date(trainingStartDateInput.value));
        } else {
            previewStartDate.textContent = '[Start Date]';
        }
        
        if (trainingEndDateInput.value) {
            previewEndDate.textContent = formatDate(new Date(trainingEndDateInput.value));
        } else {
            previewEndDate.textContent = '[End Date]';
        }
    }
    
    // Format date to readable string
    function formatDate(date) {
        if (!(date instanceof Date) || isNaN(date)) return 'Invalid Date';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Show notification
    function showNotification(message, isSuccess = true) {
        const icon = notification.querySelector('i');
        const text = notification.querySelector('p');
        
        if (isSuccess) {
            notification.style.backgroundColor = '#4caf50';
            icon.className = 'fas fa-check-circle';
        } else {
            notification.style.backgroundColor = '#f44336';
            icon.className = 'fas fa-exclamation-circle';
        }
        
        text.textContent = message;
        notification.style.display = 'block';
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
    
    // Form submission handler
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            showNotification('Please fix the errors in the form', false);
            return;
        }
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Prepare form data
        const formData = {
            participantName: participantNameInput.value.trim(),
            certificateNumber: certificateNumberInput.value.trim(),
            trainingStartDate: trainingStartDateInput.value,
            trainingEndDate: trainingEndDateInput.value,
            submissionDate: new Date().toISOString()
        };
        
        try {
            // Replace this URL with your Google Apps Script web app URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwnWD17NqZ_T3WkHsHwWYiEWH3B3i6HFM2ocMl9OtDMEBlYSKuAXVT2CJho448PUvac/exec';
            
            // Send data to Google Sheets via Google Apps Script
            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Important for cross-origin requests
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Since we're using no-cors mode, we can't check the response
            // In a real implementation, you would handle the response properly
            
            // Simulate a delay for demonstration
            setTimeout(() => {
                // Hide loading overlay
                loadingOverlay.style.display = 'none';
                
                // Show success notification
                showNotification('Certificate submitted successfully! Data saved to Google Sheets.');
                
                // Reset form
                form.reset();
                
                // Reset date to today
                trainingStartDateInput.value = today;
                trainingEndDateInput.min = today;
                trainingEndDateInput.value = '';
                
                // Update preview
                updatePreview();
                
                // Log the data that would be sent (for demonstration)
                console.log('Form data submitted:', formData);
            }, 1500);
            
        } catch (error) {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            // Show error notification
            showNotification('Error submitting form. Please try again.', false);
            
            console.error('Error:', error);
        }
    });
    
    // Reset form handler
    form.addEventListener('reset', function() {
        // Clear error messages
        nameError.textContent = '';
        certNumberError.textContent = '';
        startDateError.textContent = '';
        endDateError.textContent = '';
        termsError.textContent = '';
        
        // Reset date to today
        trainingStartDateInput.value = today;
        trainingEndDateInput.min = today;
        trainingEndDateInput.value = '';
        
        // Update preview
        updatePreview();
    });
});