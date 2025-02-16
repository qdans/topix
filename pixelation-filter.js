console.log("✅ pixelation-filter.js dimuat");
class PixelationFilter extends HTMLElement {
    constructor() {
console.log('✅ pixelation-filter dibuat'); {
        super();
        this.attachShadow({ mode: "open" });
        this.pixelSize = 8;
        this.scale = 1;
        this.originalImage = null;
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
            </style>
            <div class="canvas-container">
                <canvas id="pixelCanvas"></canvas>
            </div>
            <div class="controls">
                <input type="range" min="2" max="50" value="8" id="pixelSizeSlider">
                <button id="downloadButton">Download</button>
            </div>
        `;

        this.canvas = this.shadowRoot.querySelector("#pixelCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.pixelSizeSlider = this.shadowRoot.querySelector("#pixelSizeSlider");
        this.downloadButton = this.shadowRoot.querySelector("#downloadButton");

        this.pixelSizeSlider.addEventListener("input", (e) => {
            this.pixelSize = parseInt(e.target.value);
            this.applyPixelation();
        });

        this.downloadButton.addEventListener("click", () => this.downloadImage());
    }

    applyPixelation() {
        if (!this.originalImage) return;

        const width = this.originalImage.width;
        const height = this.originalImage.height;

        // Gunakan OffscreenCanvas untuk optimasi performa
        let offscreenCanvas = new OffscreenCanvas(width, height);
        let offCtx = offscreenCanvas.getContext("2d");

        offCtx.drawImage(this.originalImage, 0, 0, width / this.pixelSize, height / this.pixelSize);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(offscreenCanvas, 0, 0, width, height);
    }

    downloadImage() {
        const link = document.createElement("a");
        link.download = "pixelated_image.png";
        link.href = this.canvas.toDataURL("image/png");
        link.click();
    }
}

customElements.define("pixelation-filter", PixelationFilter);