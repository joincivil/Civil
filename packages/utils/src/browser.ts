export function getUrlSearchParam(name: string): string | null {
  if (window.URLSearchParams) {
    const urlParams = new URLSearchParams(window.location.search.slice(1));
    return urlParams.get(name);
  } else {
    // Adapted from https://davidwalsh.name/query-string-javascript
    const nameForRegex = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + nameForRegex + "=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

/** Returns array of all instances of a single URL search param e.g. searching for `"foo"` from `?foo=val1&foo=val2&bar=val3` would return `["val1", "val2"]`. */
export function getAllUrlSearchParam(name: string): string[] {
  if (window.URLSearchParams) {
    const urlParams = new URLSearchParams(window.location.search.slice(1));
    return urlParams.getAll(name);
  } else {
    const nameForRegex = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + nameForRegex + "=([^&#]*)", "g");
    const output = [];
    let results: RegExpExecArray | null;
    while (true) {
      results = regex.exec(window.location.search);
      if (!results) {
        break;
      }
      output.push(decodeURIComponent(results[1].replace(/\+/g, " ")));
    }
    return output;
  }
}

/** Copy given string to clipboard. Returns true if successful, false if failed. Should only fail on reaaally old browsers that we don't support. */
export function copyToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
  document.body.removeChild(textArea);
  return true;
}
