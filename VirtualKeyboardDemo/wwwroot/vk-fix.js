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

// Flag: when true, keyboard was opened intentionally via ⌨ button,
// so focus/pointerdown listeners must NOT hide it.
let _vkManuallyShown = false;

function initVirtualKeyboard() {
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
        console.log("Virtual Keyboard API supported. overlaysContent = true");

        const manualHosts = document.querySelectorAll('[virtualkeyboardpolicy="manual"]');
        manualHosts.forEach(host => {
            const input = getInnerInput(host);
            if (input) {
                // Set both attributes on the actual <input> inside Shadow DOM
                input.setAttribute('virtualkeyboardpolicy', 'manual');
                input.setAttribute('inputmode', 'none');

                // Hide keyboard on focus — but ONLY if we didn't just open it
                // intentionally via the ⌨ button (flag _vkManuallyShown).
                input.addEventListener('focus', () => {
                    if (_vkManuallyShown) return;
                    navigator.virtualKeyboard.hide();
                    setTimeout(() => { if (!_vkManuallyShown) navigator.virtualKeyboard.hide(); }, 0);
                    setTimeout(() => { if (!_vkManuallyShown) navigator.virtualKeyboard.hide(); }, 100);
                });

                // Also hide on click/pointerdown (fires before focus on mobile)
                input.addEventListener('pointerdown', (e) => {
                    if (_vkManuallyShown) return;
                    navigator.virtualKeyboard.hide();
                    setTimeout(() => { if (!_vkManuallyShown) navigator.virtualKeyboard.hide(); }, 0);
                });

                // Reset flag on blur so next focus can hide again
                input.addEventListener('blur', () => {
                    _vkManuallyShown = false;
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

    // Set flag BEFORE focus so the focus/pointerdown listeners don't hide
    // the keyboard we're about to open.
    _vkManuallyShown = true;
    input.focus();
    if ('virtualKeyboard' in navigator) {
        navigator.virtualKeyboard.show();
        // Re-show after a tick in case the browser's focus handler closed it
        setTimeout(() => {
            if (_vkManuallyShown) navigator.virtualKeyboard.show();
        }, 0);
        setTimeout(() => {
            if (_vkManuallyShown) navigator.virtualKeyboard.show();
        }, 100);
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