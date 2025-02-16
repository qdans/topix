class PixelationFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.imageSrc = "";
        this.pixelSize = 0;
        this.canvas = document.createElement("canvas");
        this.shadowRoot.appendChild(this.canvas);
    }

    static get observedAttributes() {
        return ["src", "pixel-size"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "src") {
            this.imageSrc = newValue;
            this.loadImage();
        } else if (name === "pixel-size") {
            this.pixelSize = parseInt(newValue, 10);
            this.applyPixelation();
        }
    }

    loadImage() {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx = this.canvas.getContext("2d");
            this.ctx.drawImage(img, 0, 0);
            this.applyPixelation();
        };
        img.src = this.imageSrc;
    }

    applyPixelation() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        const pixelSize = this.pixelSize;

        ctx.clearRect(0, 0, width, height);
        const img = new Image();
        img.src = this.imageSrc;
        img.onload = () => {
            if (pixelSize === 0) {
                ctx.drawImage(img, 0, 0, width, height);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            for (let y = 0; y < height; y += pixelSize) {
                for (let x = 0; x < width; x += pixelSize) {
                    const index = (y * width + x) * 4;
                    const red = data[index];
                    const green = data[index + 1];
                    const blue = data[index + 2];

                    for (let dy = 0; dy < pixelSize; dy++) {
                        for (let dx = 0; dx < pixelSize; dx++) {
                            const pixelIndex = ((y + dy) * width + (x + dx)) * 4;
                            data[pixelIndex] = red;
                            data[pixelIndex + 1] = green;
                            data[pixelIndex + 2] = blue;
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };
    }

    getCanvasImage(format) {
        return this.canvas.toDataURL(`image/${format}`);
    }
}

customElements.define("pixelation-filter", PixelationFilter);
