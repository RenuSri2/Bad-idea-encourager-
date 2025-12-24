const ideaInput = document.getElementById("ideaInput");
const generateBtn = document.getElementById("generateBtn");
const loadingState = document.getElementById("loadingState");
const resultsSection = document.getElementById("resultsSection");
const resultsContainer = document.getElementById("resultsContainer");
const tryAgainBtn = document.getElementById("tryAgainBtn");

ideaInput.addEventListener("input", () => {
    generateBtn.disabled = ideaInput.value.trim().length === 0;
});

generateBtn.addEventListener("click", handleGenerate);
tryAgainBtn.addEventListener("click", resetApp);

async function handleGenerate() {
    const idea = ideaInput.value.trim();
    if (!idea) return;

    document.querySelector(".input-section").classList.add("hidden");
    loadingState.classList.remove("hidden");
    resultsSection.classList.add("hidden");

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea })
        });

        const data = await response.json();
        displayResults(data.text);
    } catch (err) {
        displayError(err);
    }
}

function displayResults(markdown) {
    loadingState.classList.add("hidden");
    resultsSection.classList.remove("hidden");
    resultsContainer.innerHTML = "";

    const sections = markdown.split("## ").filter(Boolean);

    sections.forEach((section) => {
        const [title, ...content] = section.split("\n");
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <h3>${title}</h3>
            <p>${content.join("<br>")}</p>
        `;
        resultsContainer.appendChild(card);
    });

    resultsSection.scrollIntoView({ behavior: "smooth" });
}

function displayError(error) {
    loadingState.classList.add("hidden");
    resultsSection.classList.remove("hidden");
    resultsContainer.innerHTML = `
        <div class="result-card">
            <h3>⚠️ Error</h3>
            <p>Something went wrong. Try again.</p>
        </div>
    `;
}

function resetApp() {
    ideaInput.value = "";
    generateBtn.disabled = true;
    document.querySelector(".input-section").classList.remove("hidden");
    loadingState.classList.add("hidden");
    resultsSection.classList.add("hidden");
    resultsContainer.innerHTML = "";
}
