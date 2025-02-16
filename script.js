import './components/pixelation-filter.js';

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector("pixelation-filter").setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("pixelSize").addEventListener("input", function (event) {
    const value = event.target.value;
    document.getElementById("pixelValue").textContent = value;
    document.querySelector("pixelation-filter").setAttribute("pixel-size", value);
});

document.getElementById("downloadBtn").addEventListener("click", function () {
    const filterElement = document.querySelector("pixelation-filter");
    const format = document.getElementById("formatSelect").value;
    
    const link = document.createElement("a");
    link.href = filterElement.getCanvasImage(format);
    link.download = `pixelated-image.${format}`;
    link.click();
});
