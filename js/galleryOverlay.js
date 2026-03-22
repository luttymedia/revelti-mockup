// --- GALLERY OVERLAY SYSTEM ---
window.openGalleryOverlay = function(url = 'publicGalleryView.html') {
    if(document.getElementById('gallery-overlay-container')) return;
    
    const container = document.createElement('div');
    container.id = 'gallery-overlay-container';
    container.className = 'fixed inset-0 w-full h-full z-[99999] bg-gray-950 flex justify-center overflow-hidden';
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'w-full h-full border-0';
    iframe.id = 'gallery-iframe';
    
    container.appendChild(iframe);
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';

    const messageListener = function(e) {
        if (e.data === 'closeGalleryOverlay') {
            closeOverlay();
        }
    };
    window.addEventListener('message', messageListener);

    const escListener = function(e) {
        if (e.key === 'Escape') {
            closeOverlay();
        }
    };
    document.addEventListener('keydown', escListener);
    
    function closeOverlay() {
        if(document.body.contains(container)) {
            document.body.removeChild(container);
            document.body.style.overflow = '';
        }
        window.removeEventListener('message', messageListener);
        document.removeEventListener('keydown', escListener);
    }
};
