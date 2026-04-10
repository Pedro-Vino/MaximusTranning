let cropper;
const cropperModal = document.getElementById('cropperModal');
const cropperImage = document.getElementById('cropperImage');
const closeModal = document.querySelector('.close');
const confirmCrop = document.getElementById('confirmCrop');
const cancelCrop = document.getElementById('cancelCrop');

const profileInput = document.getElementById('profileInput');
const profileImage = document.getElementById('profileImage');
const editProfile = document.getElementById('editProfile');

// Ao clicar na foto de perfil
editProfile.addEventListener('click', () => {
    profileInput.click();
});

// Ao selecionar imagem
profileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            cropperImage.src = reader.result;
            openModal();
        };
        reader.readAsDataURL(file);
    }
});

function openModal() {
    cropperModal.style.display = 'flex';
    if (cropper) cropper.destroy();
    cropper = new Cropper(cropperImage, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        movable: true,
        zoomable: true,
        scalable: false,
        rotatable: false,
        dragMode: 'move',
        autoCropArea: 1
    });
}

function closeCropper() {
    if (cropper) { cropper.destroy(); cropper = null; }
    cropperModal.style.display = 'none';
}

confirmCrop.addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas({ width: 500, height: 500, imageSmoothingQuality: 'high' });
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        profileImage.src = url;
        const file = new File([blob], 'profile.png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        profileInput.files = dataTransfer.files;
        closeCropper();
    }, 'image/png');
});

cancelCrop.addEventListener('click', closeCropper);
closeModal.addEventListener('click', closeCropper);
window.addEventListener('click', (e) => {
    if (e.target === cropperModal) closeCropper();
});