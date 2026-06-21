// Dawaya Prescription OCR Simulation Engine

class PrescriptionOCREngine {
  constructor() {
    this.isScanning = false;
    this.scanInterval = null;
  }

  // Starts the OCR visual scan on the target element
  startScan(dropZoneEl, resultContainerEl, onCompleteCallback) {
    if (this.isScanning) return;

    this.isScanning = true;
    
    // 1. Setup visual laser beam
    const laser = document.createElement("div");
    laser.className = "ocr-laser-beam";
    laser.style.position = "absolute";
    laser.style.left = "0";
    laser.style.width = "100%";
    laser.style.height = "4px";
    laser.style.backgroundColor = "var(--primary)";
    laser.style.boxShadow = "0 0 15px 3px var(--primary), 0 0 30px 6px var(--accent)";
    laser.style.zIndex = "10";
    laser.style.animation = "ocrScanLaser 2.2s infinite ease-in-out";
    
    // Add laser animation keyframe if not present
    if (!document.getElementById("ocr-laser-style")) {
      const style = document.createElement("style");
      style.id = "ocr-laser-style";
      style.innerHTML = `
        @keyframes ocrScanLaser {
          0% { top: 5%; opacity: 0.8; }
          50% { top: 95%; opacity: 1; }
          100% { top: 5%; opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
    
    dropZoneEl.style.position = "relative";
    dropZoneEl.appendChild(laser);
    
    // Disable inputs inside dropZone during scanning
    dropZoneEl.style.pointerEvents = "none";
    dropZoneEl.style.opacity = "0.85";

    // 2. Perform mock processing
    setTimeout(() => {
      // Clean up scanning laser
      if (laser.parentNode) {
        laser.parentNode.removeChild(laser);
      }
      dropZoneEl.style.pointerEvents = "auto";
      dropZoneEl.style.opacity = "1";
      this.isScanning = false;

      // Render parsed medications list
      this.renderExtractedMeds(resultContainerEl, onCompleteCallback);
    }, 2800);
  }

  renderExtractedMeds(containerEl, onCompleteCallback) {
    containerEl.innerHTML = `
      <div class="ocr-results-box" style="animation: fadeIn 0.4s ease forwards;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: var(--color-success);">
          <span style="font-size: 1.4rem;">✅</span>
          <div>
            <h4 class="font-semibold" style="margin: 0;">Prescription Scanned Successfully</h4>
            <p class="text-xs" style="color: var(--text-muted); margin: 0;">OCR confidence score: 98.4%</p>
          </div>
        </div>
        
        <p class="text-sm" style="margin-bottom: 12px; color: var(--text-muted);">We detected the following medications from your doctor's handwriting. Please verify and select the items to compare prices:</p>
        
        <div class="ocr-items-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          <label class="ocr-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition); background: var(--bg-card);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <input type="checkbox" checked class="ocr-med-checkbox" value="med-2" style="width: 18px; height: 18px; accent-color: var(--primary); flex-shrink: 0;">
              <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: 6px; overflow: hidden; padding: 2px; flex-shrink: 0; border: 1px solid var(--border-color);">
                <img src="images/amoxil.png" alt="Amoxil" style="max-width: 100%; max-height: 100%; object-fit: contain;">
              </div>
              <div>
                <span class="font-semibold text-sm" style="display: block; color: var(--text-main);">Amoxil 500mg (Amoxicillin)</span>
                <span class="badge badge-danger" style="font-size: 0.65rem;">Rx Required</span>
              </div>
            </div>
            <span class="text-xs" style="color: var(--text-muted); font-weight: 600;">1 Box (12 Capsules)</span>
          </label>

          <label class="ocr-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition); background: var(--bg-card);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <input type="checkbox" checked class="ocr-med-checkbox" value="med-3" style="width: 18px; height: 18px; accent-color: var(--primary); flex-shrink: 0;">
              <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--input-bg); border-radius: 6px; overflow: hidden; padding: 2px; flex-shrink: 0; border: 1px solid var(--border-color);">
                <img src="images/lipitor.png" alt="Lipitor" style="max-width: 100%; max-height: 100%; object-fit: contain;">
              </div>
              <div>
                <span class="font-semibold text-sm" style="display: block; color: var(--text-main);">Lipitor 10mg (Atorvastatin)</span>
                <span class="badge badge-danger" style="font-size: 0.65rem;">Rx Required</span>
              </div>
            </div>
            <span class="text-xs" style="color: var(--text-muted); font-weight: 600;">1 Pack (30 Tablets)</span>
          </label>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-outline btn-sm ocr-cancel-btn">Cancel</button>
          <button class="btn btn-primary btn-sm ocr-confirm-btn">Confirm & Find Cheapest Pharmacies</button>
        </div>
      </div>
    `;

    // Hook up active selectors inside mock box
    const confirmBtn = containerEl.querySelector(".ocr-confirm-btn");
    const cancelBtn = containerEl.querySelector(".ocr-cancel-btn");

    confirmBtn.addEventListener("click", () => {
      const selectedMedIds = [];
      containerEl.querySelectorAll(".ocr-med-checkbox:checked").forEach(input => {
        selectedMedIds.push(input.value);
      });
      if (onCompleteCallback) {
        onCompleteCallback(selectedMedIds);
      }
    });

    cancelBtn.addEventListener("click", () => {
      containerEl.innerHTML = "";
    });
  }
}

window.PrescriptionOCREngine = new PrescriptionOCREngine();
