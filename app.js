(function () {
  // Release manifest, updated by the repo owner after each release.
  var MANIFEST_URL = "https://raw.githubusercontent.com/popeye0013/popeye0013/refs/heads/main/meoify-latest.json";
  // Only download links under this prefix are used, so a bad manifest can't redirect the button.
  var APK_PREFIX = "https://github.com/popeye0013/Meoify/releases/download/";

  function formatDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    var d = new Date(iso + "T00:00:00Z");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  }

  function applyRelease(m) {
    if (!m || typeof m.version !== "string" || typeof m.apk_url !== "string") return;
    if (m.apk_url.indexOf(APK_PREFIX) !== 0) return;

    var button = document.getElementById("download");
    button.href = m.apk_url;
    button.textContent = "Download v" + m.version;

    var date = typeof m.published === "string" ? formatDate(m.published) : "";
    document.getElementById("release-text").textContent =
      "Version " + m.version + (date ? ", released " + date : "") + ".";

    if (typeof m.sha256 === "string" && /^[0-9a-f]{64}$/i.test(m.sha256)) {
      document.getElementById("checksum").textContent = m.sha256;
    } else {
      document.getElementById("checksum").parentNode.hidden = true;
    }
    document.getElementById("release").hidden = false;

    if (Array.isArray(m.changelog) && m.changelog.length) {
      var list = document.getElementById("changelog");
      list.textContent = "";
      m.changelog.forEach(function (item) {
        if (typeof item !== "string") return;
        var li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      document.getElementById("whats-new-date").textContent =
        "Version " + m.version + (date ? ", released " + date : "") + ".";
      document.getElementById("whats-new").hidden = false;
    }
  }

  // If the manifest can't be loaded, the page keeps the fallback link to the latest release.
  fetch(MANIFEST_URL, { cache: "no-cache" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(applyRelease)
    .catch(function () {});
})();
