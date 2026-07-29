// VirtualKeyboard API — functions exposed globally for Blazor interop
// Handles FluentTextInput web components (Shadow DOM) and standard inputs

function getInnerInput(hostEl) {
    // If it's a fluent-text-input web component, get the <input> from shadow DOM
    if (hostEl && hostEl.shadowRoot) {
        return hostEl.shadowRoot.querySelector('input');
    }
    // If it's already a standard <input>, return it directly
    if (hostEl && hostEl.tagName === 'INPUT') {
        return hostEl;
    }
    return null;
}

function initVirtualKeyboard() {
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
        console.log("Virtual Keyboard API supported. overlaysContent = true");

        // Find all elements with virtualkeyboardpolicy="manual"
        // These can be <fluent-text-input> web components or standard <input> elements
        const manualHosts = document.querySelectorAll('[virtualkeyboardpolicy="manual"]');
        manualHosts.forEach(host => {
            const input = getInnerInput(host);
            if (input) {
                // Set the attribute on the actual <input> element inside shadow DOM
                input.setAttribute('virtualkeyboardpolicy', 'manual');
                // On focus, explicitly hide the virtual keyboard
                input.addEventListener('focus', () => {
                    navigator.virtualKeyboard.hide();
                });
                console.log("VirtualKeyboard: manual policy applied to inner input:", input.id || input.tagName);
            }
        });
    } else {
        console.warn("VirtualKeyboard API is not supported in this browser.");
    }
}

function clearManualInput() {
    const host = document.getElementById('manual-input');
    const input = getInnerInput(host);
    if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        // Also update the host element's value for FluentTextInput binding
        if (host && host !== input) {
            host.value = '';
            host.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

function showVirtualKeyboard() {
    const host = document.getElementById('manual-input');
    const input = getInnerInput(host);
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