// VirtualKeyboard API — functions exposed globally for Blazor interop
// Handles FluentTextInput web components (Shadow DOM) and standard inputs
// Supports multiple fields via element ID parameters

function getInnerInput(hostEl) {
    if (hostEl && hostEl.shadowRoot) {
        return hostEl.shadowRoot.querySelector('input');
    }
    if (hostEl && hostEl.tagName === 'INPUT') {
        return hostEl;
    }
    return null;
}

function initVirtualKeyboard() {
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
        console.log("Virtual Keyboard API supported. overlaysContent = true");

        const manualHosts = document.querySelectorAll('[virtualkeyboardpolicy="manual"]');
        manualHosts.forEach(host => {
            const input = getInnerInput(host);
            if (input) {
                input.setAttribute('virtualkeyboardpolicy', 'manual');
                input.addEventListener('focus', () => {
                    navigator.virtualKeyboard.hide();
                });
                console.log("VirtualKeyboard: manual policy applied to:", host.id || host.tagName);
            }
        });
    } else {
        console.warn("VirtualKeyboard API is not supported in this browser.");
    }
}

function clearField(elementId) {
    const host = document.getElementById(elementId);
    if (!host) return;
    const input = getInnerInput(host);
    if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (host && host !== input) {
        host.value = '';
        host.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function showKeyboardFor(elementId) {
    const host = document.getElementById(elementId);
    if (!host) return;
    const input = getInnerInput(host);
    if (!input) return;
    input.focus();
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.show();
    }
}

// Legacy compat
function clearManualInput() { clearField('manual-input'); }
function showVirtualKeyboard() { showKeyboardFor('manual-input'); }

// Expose globally for Blazor JSInterop
window.initVirtualKeyboard = initVirtualKeyboard;
window.clearField = clearField;
window.showKeyboardFor = showKeyboardFor;
window.clearManualInput = clearManualInput;
window.showVirtualKeyboard = showVirtualKeyboard;