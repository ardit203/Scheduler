const backdrop = document.createElement("div");
backdrop.className = "overlay-backdrop";
backdrop.id = "lessonOverlay";

backdrop.innerHTML = `
    <div class="overlay-card" role="dialog" aria-modal="true" aria-labelledby="overlayTitle">
      <div class="overlay-topbar">
        <div class="overlay-accent" id="overlayAccent"></div>
        <div>
          <h2 class="overlay-title" id="overlayTitle"></h2>
          <div class="overlay-subtitle" id="overlaySubtitle"></div>
        </div>
        <button class="overlay-close" type="button" id="overlayClose" aria-label="Close">×</button>
      </div>
    
      <div class="overlay-body">
        <div class="overlay-grid">
          <div class="overlay-label">Classroom</div>
          <div class="overlay-value" id="overlayRoom"></div>
    
          <div class="overlay-label">Classes</div>
          <div class="overlay-value" id="overlayClasses"></div>
    
          <div class="overlay-label">Professors</div>
          <div class="overlay-value" id="overlayProf"></div>
        </div>
      </div>
    
      <div class="overlay-footer">
        <button class="overlay-btn" type="button" id="overlayClose2">Close</button>
      </div>
    </div>
`;

document.body.appendChild(backdrop);

const card = backdrop.querySelector(".overlay-card");
const closeBtn = document.getElementById("overlayClose");
const closeBtn2 = document.getElementById("overlayClose2");

export function hideOverlay() {
    backdrop.classList.remove("is-open");
    document.body.classList.remove("modal-open");
}

export function showOverlay(item) {
    if (item == null) {
        return
    }
    // Safe reads with fallbacks for your keys
    const title = item["subject"] || item["short_name"] || "Lesson";
    const subtitle = item["time"] ? `${item["day"] || ""} • ${item["time"]}`.trim() : (item["day"] || "");
    const room = item["classroom"] || "";
    const classes = item["classes"] || "";
    const prof = item["teachers"] || "";

    // Fill text content (no HTML injection)
    document.getElementById("overlayTitle").textContent = title;
    document.getElementById("overlaySubtitle").textContent = subtitle;
    document.getElementById("overlayRoom").textContent = room;
    document.getElementById("overlayClasses").textContent = classes;
    document.getElementById("overlayProf").textContent = prof;

    // Accent color (optional)
    const accent = document.getElementById("overlayAccent");
    accent.style.background = item["color"] || "#64748b";

    backdrop.classList.add("is-open");
    document.body.classList.add("modal-open");
}

// Close interactions
closeBtn.addEventListener("click", hideOverlay);
closeBtn2.addEventListener("click", hideOverlay);

backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) hideOverlay(); // click outside card
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("is-open")) hideOverlay();
});

// expose functions globally so you can call them from your timetable code

