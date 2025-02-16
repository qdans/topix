class PixelationFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.pixelSize = 0; // Mulai dari 0 (paling halus)
        this.scale = 1;
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
                }
                input[type="range"] {
                    width: 300px;
                    margin: 10px;
                }
            </style>
            <label for="pixelSize">Pixel Size: <span id="pixelValue">${this.pixelSize}</span></label>
            <input type="range" id="pixelSize" min="0" max="50" step="1" value="${this.pixelSize}">
            <div class="canvas-container">
                <canvas id="canvas"></canvas>
            </div>
        `;

        this.setupEvents();
    }

    setupEvents() {
        const slider = this.shadowRoot.querySelector("#pixelSize");
        const pixelValueDisplay = this.shadowRoot.querySelector("#pixelValue");

        slider.addEventListener("input", (event) => {
            this.pixelSize = parseInt(event.target.value, 10);
            pixelValueDisplay.textContent = this.pixelSize;
            this.applyPixelation();
        });
    }

    applyPixelation() {
        // Logika untuk menerapkan efek pixelation
        console.log(`Applying pixelation with size: ${this.pixelSize}`);
    }
}

customElements.define("pixelation-filter", PixelationFilter);
