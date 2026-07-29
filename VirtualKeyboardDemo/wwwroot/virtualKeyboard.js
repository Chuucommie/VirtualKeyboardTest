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