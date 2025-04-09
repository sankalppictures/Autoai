let selectedType = null;
let cropper = null;

document.getElementById('uploadImage').addEventListener('click', () => {
  selectedType = 'photo';
  document.getElementById('imageInput').click();
});

document.getElementById('uploadSignature').addEventListener('click', () => {
  selectedType = 'signature';
  document.getElementById('imageInput').click();
});

document.getElementById('imageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('cropImage').src = reader.result;
    document.getElementById('cropperModal').classList.remove('hidden');

    if (cropper) cropper.destroy();
    const image = document.getElementById('cropImage');
    cropper = new Cropper(image, {
      aspectRatio: selectedType === 'photo' ? 3.8 / 4.5 : NaN,
      viewMode: 1
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById('cropOk').addEventListener('click', async () => {
  document.getElementById('cropperModal').classList.add('hidden');
  document.getElementById('processingScreen').classList.remove('hidden');

  const canvas = cropper.getCroppedCanvas({
    width: selectedType === 'photo' ? 413 : 400,
    height: selectedType === 'photo' ? 531 : 200
  });

  // Convert to blob and compress
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
  const compressedBlob = await imageCompression(blob, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 600,
    useWebWorker: true
  });

  const outputUrl = URL.createObjectURL(compressedBlob);
  document.getElementById('outputImage').src = outputUrl;
  document.getElementById('outputImage').classList.remove('hidden');
  document.getElementById('downloadLink').href = outputUrl;
  document.getElementById('downloadLink').classList.remove('hidden');

  document.getElementById('processingScreen').classList.add('hidden');
  document.querySelector('.output').classList.remove('hidden');
  document.getElementById('notification').classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('notification').classList.add('hidden');
 
