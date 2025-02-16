class PixelationFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .container {
                    padding: 20px;
                    border-radius: 10px;
                    background: white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                canvas {
                    border: 1px solid blue;
                    margin-bottom: 10px;
                }
            </style>
            <div class="container">
                <input type="file" id="upload" accept="image/*">
                <canvas></canvas>
                <label>Pixel Size: <span id="sizeLabel">0</span></label>
                <input type="range" id="pixelSize" min="0" max="20" value="0">
                <button id="download">Download</button>
                <select id="format">
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                </select>
            </div>
        `;
        this.canvas = this.shadowRoot.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fileInput = this.shadowRoot.querySelector('#upload');
        this.pixelSizeInput = this.shadowRoot.querySelector('#pixelSize');
        this.sizeLabel = this.shadowRoot.querySelector('#sizeLabel');
        this.downloadBtn = this.shadowRoot.querySelector('#download');
        this.formatSelect = this.shadowRoot.querySelector('#format');
        
        this.image = new Image();
        this.fileInput.addEventListener('change', this.loadImage.bind(this));
        this.pixelSizeInput.addEventListener('input', this.applyPixelation.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadImage.bind(this));
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                this.image.src = e.target.result;
            };
            reader.readAsDataURL(file);
            this.image.onload = () => this.drawImage();
        }
    }

    drawImage() {
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.ctx.drawImage(this.image, 0, 0);
    }

    applyPixelation() {
        const size = parseInt(this.pixelSizeInput.value);
        this.sizeLabel.textContent = size;
        this.drawImage();
        if (size > 0) {
            let w = this.canvas.width;
            let h = this.canvas.height;
            this.ctx.drawImage(this.canvas, 0, 0, w / size, h / size);
            this.ctx.drawImage(this.canvas, 0, 0, w / size, h / size, 0, 0, w, h);
        }
    }

    downloadImage() {
        const format = this.formatSelect.value;
        const link = document.createElement('a');
        link.download = `pixelated.${format}`;
        link.href = this.canvas.toDataURL(`image/${format}`);
        link.click();
    }
}
customElements.define('pixelation-filter', PixelationFilter);
