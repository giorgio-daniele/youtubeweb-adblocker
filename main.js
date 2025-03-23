let blockedDomains = [];

// Load the list of domains from the `list.dat` file
const loadBlockedDomains = async () => {
  try {
    const response = await fetch(browser.runtime.getURL("list.dat"));
    const text = await response.text();
    blockedDomains = text
      .split('\n')
      .map(domain => domain.trim())
      .filter(Boolean);  // Remove empty domains
    console.log('Blocked domains loaded:', blockedDomains);
  } catch (error) {
    console.error('Failed to load blocked domains:', error);
  }
};

// Handle extension installation and reloading
if (typeof browser !== 'undefined') {
  // Firefox and Edge
  browser.runtime.onInstalled.addListener(loadBlockedDomains);
} else if (typeof chrome !== 'undefined') {
  // Chrome
  chrome.runtime.onInstalled.addListener(loadBlockedDomains);
}

// Block network requests if the domain matches one in the blocked list
const blockRequest = (details) => {
  if (blockedDomains.some(domain => details.url.includes(domain))) {
    //console.log(`Blocked request to: ${details.url}`);
    return { cancel: true };
  }
};

// Listen for requests and block if necessary
if (typeof browser !== 'undefined') {
  // Firefox and Edge
  browser.webRequest.onBeforeRequest.addListener(
    blockRequest,
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
} else if (typeof chrome !== 'undefined') {
  // Chrome
  chrome.webRequest.onBeforeRequest.addListener(
    blockRequest,
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
}
