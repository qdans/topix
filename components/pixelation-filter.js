class PixelationFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.pixelSize = 0;
        this.originalImage = null; // Menyimpan gambar asli
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .canvas-container {
                    overflow: hidden;
                    width: 500px;
                    height: 500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid #007bff;
                    border-radius: 5px;
                    position: relative;
                }
                canvas {
                    max-width: 100%;
                    max-height: 100%;
                    transform: scale(1);
                    transition: transform 0.3s ease;
                }
                input[type='range'] {
                    width: 80%;
                    margin: 10px 0;
                }
                .controls {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 10px;
                }
                .download-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 10px;
                }
                button {
                    padding: 10px 15px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background 0.3s;
                }
                button:hover {
                    background-color: #0056b3;
                }
                select {
                    padding: 8px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                }
            </style>
            <input type="file" id="upload" accept="image/*" />
            <div class="canvas-container">
                <canvas id="canvas"></canvas>
            </div>
            <div class="controls">
                <label>Pixel Size: <span id="pixelValue">0</span></label>
                <input type="range" id="pixelRange" min="0" max="50" value="0">
                <button id="applyPixelation">Apply Pixelation</button>
                <div class="download-container">
                    <button id="downloadImage">Download</button>
                    <select id="formatSelect">
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="webp">WebP</option>
                    </select>
                </div>
            </div>
        `;

        this.canvas = this.shadowRoot.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.uploadInput = this.shadowRoot.getElementById("upload");
        this.pixelRange = this.shadowRoot.getElementById("pixelRange");
        this.pixelValue = this.shadowRoot.getElementById("pixelValue");
        this.applyButton = this.shadowRoot.getElementById("applyPixelation");
        this.downloadButton = this.shadowRoot.getElementById("downloadImage");
        this.formatSelect = this.shadowRoot.getElementById("formatSelect");

        this.uploadInput.addEventListener("change", (e) => this.loadImage(e));
        this.pixelRange.addEventListener("input", (e) => this.updatePixelSize(e));
        this.applyButton.addEventListener("click", () => this.applyPixelation());
        this.downloadButton.addEventListener("click", () => this.downloadImage());
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.originalImage = img; // Simpan gambar asli
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updatePixelSize(event) {
        this.pixelSize = parseInt(event.target.value, 10);
        this.pixelValue.textContent = this.pixelSize;
        if (this.pixelSize === 0) {
            this.restoreOriginalImage();
        } else {
            this.applyPixelation();
        }
    }

    restoreOriginalImage() {
        if (this.originalImage) {
            this.ctx.drawImage(this.originalImage, 0, 0);
        }
    }

    applyPixelation() {
        if (!this.originalImage) return;
        const { width, height } = this.canvas;
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = Math.ceil(width / this.pixelSize);
        tempCanvas.height = Math.ceil(height / this.pixelSize);

        tempCtx.drawImage(this.originalImage, 0, 0, tempCanvas.width, tempCanvas.height);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(tempCanvas, 0, 0, width, height);
    }

    downloadImage() {
        const format = this.formatSelect.value;
        const link = document.createElement("a");
        link.download = `pixelated_image.${format}`;
        link.href = this.canvas.toDataURL(`image/${format}`);
        link.click();
    }
}

customElements.define("pixelation-filter", PixelationFilter);
