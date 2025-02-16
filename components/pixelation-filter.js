class PixelationFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.pixelSize = 8;
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
                }
                .canvas-container {
                    width: 500px;
                    height: 500px;
                    border: 2px solid #007bff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }
                canvas {
                    max-width: 100%;
                    max-height: 100%;
                }
                input[type="range"] {
                    width: 80%;
                    margin-top: 10px;
                }
            </style>
            <input type="file" id="upload" accept="image/*" />
            <div class="canvas-container">
                <canvas id="canvas"></canvas>
            </div>
            <label>Pixel Size: <span id="pixelValue">8</span></label>
            <input type="range" id="pixelRange" min="0" max="50" value="8">
        `;

        this.canvas = this.shadowRoot.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.uploadInput = this.shadowRoot.getElementById("upload");
        this.pixelRange = this.shadowRoot.getElementById("pixelRange");
        this.pixelValue = this.shadowRoot.getElementById("pixelValue");

        this.uploadInput.addEventListener("change", (e) => this.loadImage(e));
        this.pixelRange.addEventListener("input", (e) => this.updatePixelSize(e));
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.onload = () => {
                this.canvas.width = this.originalImage.width;
                this.canvas.height = this.originalImage.height;
                this.ctx.drawImage(this.originalImage, 0, 0);
            };
            this.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updatePixelSize(event) {
        this.pixelSize = event.target.value;
        this.pixelValue.textContent = this.pixelSize;
        this.applyPixelation();
    }

    applyPixelation() {
        if (!this.originalImage) return;

        const { width, height } = this.canvas;
        if (this.pixelSize == 0) {
            this.ctx.drawImage(this.originalImage, 0, 0);
            return;
        }

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = Math.ceil(width / this.pixelSize);
        tempCanvas.height = Math.ceil(height / this.pixelSize);

        tempCtx.drawImage(this.originalImage, 0, 0, tempCanvas.width, tempCanvas.height);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(tempCanvas, 0, 0, width, height);
    }
}

customElements.define("pixelation-filter", PixelationFilter);
