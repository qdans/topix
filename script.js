// script.js (Updated)

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const pixelCanvas = document.getElementById("pixelCanvas");
    const pixelSlider = document.getElementById("pixelSlider");
    const pixelSizeValue = document.getElementById("pixelSizeValue");
    const downloadBtn = document.getElementById("downloadBtn");
    const formatSelect = document.getElementById("formatSelect");

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                pixelCanvas.image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    pixelSlider.addEventListener("input", (event) => {
        const pixelValue = event.target.value;
        pixelSizeValue.textContent = pixelValue;
        pixelCanvas.pixel = parseInt(pixelValue);
    });

    downloadBtn.addEventListener("click", () => {
        const format = formatSelect.value;
        const canvas = pixelCanvas.shadowRoot.querySelector("canvas");
        const link = document.createElement("a");
        link.download = `pixelated-image.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    });
});
