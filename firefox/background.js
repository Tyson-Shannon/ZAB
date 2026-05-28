const browserAPI = chrome || browser; //compatibility wrapper

//cached state
let enabled = true;
//load setting once
browserAPI.storage.local.get(["enabled"], (result) => {
    enabled = result.enabled !== false;
});
//keep it updated
browserAPI.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        enabled = changes.enabled.newValue !== false;
    }
});

browserAPI.webNavigation.onBeforeNavigate.addListener((details) => {
    try {

        if (!enabled) {
            return;
        }

        const url = new URL(details.url);

        // Match all Google domains
        const isGoogle =
            url.hostname.startsWith("www.google.");

        const isSearchPage =
            url.pathname === "/search";

        if (!isGoogle || !isSearchPage) {
            return;
        }

        // Already web-only
        if (url.searchParams.get("udm") === "14") {
            return;
        }

        // Add web mode
        url.searchParams.set("udm", "14");

        browserAPI.tabs.update(details.tabId, {
            url: url.toString()
        });
    } catch (err) {
        console.error(err);
    }
});