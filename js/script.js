const KL_CONFIG = {
  domain: "🗿🤠.ws",
  redirectUrl: new URL("./TEST", window.location.href).href, // Fyll inn link
  city: "could not fetch",
  brand: "Kloudflare",
  rayLength: 16,
  badgePath: "img/kloudflare.png",
  minDelay: 800,
  maxDelay: 1200
};

function makeRay(len) {
  const chars = "abcdef0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function buildApp(rayId) {
  return `
    <div class="content">
      <div class="domain-name">${KL_CONFIG.domain}</div>

      <div class="description">
        Verify you are human by completing the action below.
      </div>

      <div class="verify-box">
        <div class="verify-inner">
          <div class="left-area" id="left-area">
            <input type="checkbox" id="human-check" aria-label="Human verification checkbox">
            <label id="verify-label" for="human-check">Verify you are human</label>
            
c*r**r="status" aria-label="Verifying">
          </div>

          <div class="right-area">
            <div class="badge" title="Kloudflare™ (parody)">
              <img src="${KL_CONFIG.badgePath}" alt="Kloudflare badge">
            </div>
          </div>
        </div>
      </div>

      <div class="ray-big">Ray ID: ${rayId}</div>
    </div>

    <div class="footer-container">
      <div class="footer-line"></div>
      <div class="footer-info">
        <span class="footer-item">${KL_CONFIG.brand}</span>
        <span class="footer-item">${KL_CONFIG.city}</span>
        <span class="footer-item">Ray ID: ${rayId}</span>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const ray = makeRay(KL_CONFIG.rayLength);
  document.getElementById("app-root").innerHTML = buildApp(ray);

  const checkbox = document.getElementById("human-check");
  const spinner = document.getElementById("spinner");
  const label = document.getElementById("verify-label");

  // Prevent double-clicks
  checkbox.addEventListener("click", (e) => {
    if (checkbox.dataset.processing === "true") {
      e.preventDefault();
    }
  });

  checkbox.addEventListener("change", () => {
    if (!checkbox.checked) return;
    
    checkbox.dataset.processing = "true";

    // Smooth fade out
    checkbox.style.opacity = "0";
    label.style.opacity = "0";
    
    setTimeout(() => {
      checkbox.style.display = "none";
      label.style.display = "none";
      spinner.style.display = "inline-block";
      
      // Trigger reflow for animation
      spinner.offsetHeight;
      spinner.classList.add("active");
    }, 150);

    // Random delay with slight variation
    const delay = KL_CONFIG.minDelay + Math.floor(Math.random() * (KL_CONFIG.maxDelay - KL_CONFIG.minDelay));

    setTimeout(() => {
      window.location.href = KL_CONFIG.redirectUrl;
    }, delay + 150);
  });
});
