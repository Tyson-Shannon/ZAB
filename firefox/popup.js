const browserAPI = chrome || browser; //compatibility wrapper
const toggleButton = document.getElementById("toggle");

async function updateButton() {
    const result = await browserAPI.storage.local.get(["enabled"]);

    const enabled = result.enabled !== false;

    toggleButton.textContent =
        enabled
            ? "ON"
            : "OFF";

    toggleButton.style.background =
        enabled
            ? "#4CAF50"
            : "#f44336";

    toggleButton.style.color = "white";
}

toggleButton.addEventListener("click", async () => {
    const result = await browserAPI.storage.local.get(["enabled"]);

    const enabled = result.enabled !== false;

    await browserAPI.storage.local.set({
        enabled: !enabled
    });

    updateButton();
});

updateButton();