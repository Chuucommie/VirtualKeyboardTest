// VirtualKeyboard API — functions exposed globally for Blazor interop

function initVirtualKeyboard() {
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
        const manualInputs = document.querySelectorAll('[virtualkeyboardpolicy="manual"]');
        manualInputs.forEach(input => {
            input.addEventListener('focus', () => {
                navigator.virtualKeyboard.hide();
            });
        });
        console.log("Virtual Keyboard API initialized.");
    } else {
        console.warn("VirtualKeyboard API is not supported in this browser.");
    }
}

function clearManualInput() {
    const input = document.getElementById('manual-input');
    if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function showVirtualKeyboard() {
    const input = document.getElementById('manual-input');
    if (!input) return;
    input.focus();
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.show();
    }
}

// Expose globally for Blazor JSInterop
window.initVirtualKeyboard = initVirtualKeyboard;
window.clearManualInput = clearManualInput;
window.showVirtualKeyboard = showVirtualKeyboard;