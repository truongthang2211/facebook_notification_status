var listHistory = [];
var loading = false;
const root = document.querySelector(
  "body > div >div > div:nth-child(1) > .rq0escxv  > [data-visualcompletion='ignore']"
);
root.addEventListener("DOMNodeInserted", (e) => {
  if (
    e.target.className ==
    "pmk7jnqg j83agx80 bp9cbjyn taijpn5t tmrshh9y m7zwrmfr oud54xpy"
  ) {
    AddEvenforTarget(e.target);
  } else if (e.target.className == "poy2od1o i09qtzwb n7fi1qx3") {
    const TargetsElement = e.target.querySelectorAll(
      ".pmk7jnqg.j83agx80.bp9cbjyn.taijpn5t.tmrshh9y.m7zwrmfr.oud54xpy"
    );
    TargetsElement.forEach((element) => {
      AddEvenforTarget(element);
    });
  }
});
function AddEvenforTarget(element) {
  if (element) {
    const TargetName = element
      .querySelector("div:nth-child(1)")
      .getAttribute("aria-label")
      .replace("Mở đoạn chat với ", "")
      .replace("Open chat with ", "");
    console.log("add detected");

    const isOnline = element.querySelector(
      ".pmk7jnqg:not(.aew9gpjp):not(.s45kfl79)"
    );
    if (isOnline) {
      console.log(isOnline);

      isOnline.addEventListener("DOMNodeInserted", () => {
        handleStatusChange(TargetName, true);
      });
      isOnline.addEventListener("DOMNodeRemoved", () => {
        handleStatusChange(TargetName, false);
      });
    }
  }
}
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
      OnlineText = result.onlinetext ?? "{name} is now online";
      OfflineText = result.offlinetext ?? "{name} is offline";
      Lang = result.language ?? "Microsoft David - English (United States)";
      Speed = result.speed ?? 25;
      const speechText = `${online ? OnlineText : OfflineText}`.replace(
        "{name}",
        TargetName
      );
      const logger = `${new Date().toLocaleString("vi")} ${speechText}`;
      console.log(logger);
      listHistory.push({
        time: new Date().toLocaleString("vi"),
        text: `${online ? OnlineText : OfflineText}`,
        targetName: TargetName,
      });

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
    console.log("remove detected");
    const isOnline = e.target.querySelector(".pmk7jnqg:not(.aew9gpjp)");
    isOnline.removeEventListener("DOMNodeInserted", () => {});
    isOnline.removeEventListener("DOMNodeRemoved", () => {});
  }
});
function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
