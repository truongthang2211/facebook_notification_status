var listHistory = [];
var loading = false;
document.body.addEventListener("DOMNodeInserted", (e) => {
  if (
    e.target.className ==
    "pmk7jnqg j83agx80 bp9cbjyn taijpn5t tmrshh9y m7zwrmfr oud54xpy"
  ) {
    const TargetName = e.target
      .querySelector("div:nth-child(1)")
      .getAttribute("aria-label")
      .replace("Mở đoạn chat với ", "")
      .replace("Open chat with ", "");
    const isOnline = e.target.querySelector(".pmk7jnqg:not(.aew9gpjp)");
    console.log(isOnline);

    isOnline.addEventListener("DOMNodeInserted", () => {
      handleStatusChange(TargetName, true);
    });
    isOnline.addEventListener("DOMNodeRemoved", () => {
      handleStatusChange(TargetName, false);
    });
  }
});
function handleStatusChange(TargetName, online) {
  var OnlineText, OfflineText, Speed, Lang;
  chrome.storage.local.get(
    [
      "onlinetext",
      "offlinetext",
      "speed",
      "online-speech",
      "offline-speech",
      "language",
    ],
    function (result) {
      OnlineText = result.onlinetext ?? "{name} đang online";
      OfflineText = result.offlinetext ?? "{name} đã offline";
      Lang =
        result.language ??
        "Microsoft HoaiMy Online (Natural) - Vietnamese (Vietnam)";
      Speed = result.speed ?? 25;
      const speechText = `${online ? OnlineText : OfflineText}`.replace(
        "{name}",
        TargetName
      );
      const logger = `${new Date().toLocaleString("vi")} ${speechText}`;
      console.log(logger);
      listHistory.push(
        `<p><b>[${new Date().toLocaleString("vi")}]</b> ${
          online ? OnlineText : OfflineText
        }</p>`.replace("{name}", `<b style="color:#baedac">${TargetName}</b>`)
      );

      if (!loading) AddHistory(listHistory);
      if (result["online-speech"] === false && online) return;
      if (result["offline-speech"] === false && !online) return;
      chrome.runtime.sendMessage({
        toSay: speechText,
        speed: Speed,
        language: Lang,
      });
    }
  );
}
function AddHistory(listHistoryG) {
  if (listHistoryG.length > 0) {
    loading = true;
    chrome.storage.local.get(["history"], function (result) {
      var listHistory = result.history ?? [];
      listHistory.unshift(listHistoryG.shift());
      chrome.storage.local.set({ history: listHistory }, function () {
        loading = false;
        AddHistory(listHistoryG);
      });
    });
  }
}
document.body.addEventListener("DOMNodeRemoved", (e) => {
  if (
    e.target.className ==
    "pmk7jnqg j83agx80 bp9cbjyn taijpn5t tmrshh9y m7zwrmfr oud54xpy"
  ) {
    e.target.removeEventListener("DOMNodeInserted", () => {});
    e.target.removeEventListener("DOMNodeRemoved", () => {});
  }
});
function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
