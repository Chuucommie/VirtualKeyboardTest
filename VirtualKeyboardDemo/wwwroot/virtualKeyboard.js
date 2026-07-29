export function initVirtualKeyboard() {
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
        const manualInputs = document.querySelectorAll('[virtualkeyboardpolicy="manual"]');
        manualInputs.forEach(input => {
            input.addEventListener('focus', () => {
                navigator.virtualKeyboard.hide();
            });
        });
        console.log("Virtual Keyboard API initialized via module.");
    } else {
        console.warn("VirtualKeyboard API is not supported in this browser.");
    }
}

export function clearInput(element) {
    if (element) {
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

export function showKeyboard(element) {
    if (!element) return;
    element.focus();
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.show();
    } else {
        // Fallback: rfocus triggers keyboard on most browsers
        element.focus({ preventScroll: true });
    }
}