// pixelation-filter.js (Updated)

class PixelationFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.imageSrc = "";
        this.pixelSize = 0;
    }

    connectedCallback() {
        this.render();
    }

    set image(src) {
        this.imageSrc = src;
        this.render();
    }

    set pixel(size) {
        this.pixelSize = size;
        this.applyPixelation();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                canvas {
                    max-width: 100%;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                }
            </style>
            <canvas></canvas>
        `;
        if (this.imageSrc) this.loadImage();
    }

    loadImage() {
        const canvas = this.shadowRoot.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = this.imageSrc;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    }

    applyPixelation() {
        const canvas = this.shadowRoot.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        if (!this.imageSrc || this.pixelSize === 0) {
            this.loadImage();
            return;
        }
        const img = new Image();
        img.src = this.imageSrc;
        img.onload = () => {
            const { width, height } = canvas;
            const pixel = Math.max(this.pixelSize, 1);
            ctx.drawImage(img, 0, 0, width / pixel, height / pixel);
            ctx.drawImage(canvas, 0, 0, width / pixel, height / pixel, 0, 0, width, height);
        };
    }
}

customElements.define("pixelation-filter", PixelationFilter);
