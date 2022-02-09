const OnlineText = document.querySelector("#onlinetext");
const OfflineText = document.querySelector("#offlinetext");
const RangeBar = document.querySelector("#speed-control");
const SpeedText = document.querySelector("#speed-text");
const Submit = document.querySelector("#submit");
const HistoryE = document.querySelector("#history");
const HistoryDelete = document.querySelector("#history-delete");
const Language = document.querySelector("#language");
const OnlineSpan = document.querySelector("#online-span");
const OfflineSpan = document.querySelector("#offline-span");

OnlineSpan.onclick = handleToggle;
OfflineSpan.onclick = handleToggle;
OnlineText.onchange = handleonChange;
OfflineText.onchange = handleonChange;
RangeBar.onchange = handleonChange;
Language.onchange = handleonChange;
chrome.storage.local.get(
  [
    "onlinetext",
    "offlinetext",
    "speed",
    "history",
    "online-speech",
    "offline-speech",
    "language",
  ],
  function (result) {
    OnlineText.value = result.onlinetext ?? "{name} đang online";
    OfflineText.value = result.offlinetext ?? "{name} đã offline";
    Language.value =
      result.language ??
      "Microsoft HoaiMy Online (Natural) - Vietnamese (Vietnam)";
    RangeBar.value = result.speed ?? 25;
    SpeedText.innerHTML = (RangeBar.value * 3) / 100;
    if (result["online-speech"] === undefined || result["online-speech"])
      OnlineSpan.classList.add("active");
    if (result["offline-speech"] === undefined || result["offline-speech"])
      OfflineSpan.classList.add("active");
    var listHistory = result.history ?? [];
    listHistory.map((e) => {
      HistoryE.innerHTML += `<p>${e}</p>`;
    });
  }
);

// Submit.onclick = function () {

function handleonChange(e) {
  chrome.storage.local.set(
    {
      [e.target.name]: e.target.value,
    },
    function () {
      console.log("Value is set");
    }
  );
}
RangeBar.oninput = (e) => {
  if (e.target.value < 4) {
    e.target.value = 4;
  }
  SpeedText.innerHTML = (e.target.value * 3) / 100;
};
HistoryDelete.onclick = (e) => {
  chrome.storage.local.set(
    {
      history: [],
    },
    function () {
      console.log("History Deleted");
      HistoryE.innerHTML = "";
    }
  );
};
function handleToggle(e) {
  console.log(e.target.innerHTML);
  const status = e.target.classList.toggle("active");
  var key = "offline-speech";
  if (e.target.innerHTML === "Online") {
    key = "online-speech";
  }
  chrome.storage.local.set(
    {
      [key]: status,
    },
    function () {
      console.log({
        [key]: status,
      });
    }
  );
}
