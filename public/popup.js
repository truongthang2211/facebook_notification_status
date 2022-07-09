const OnlineText = document.querySelector("#onlinetext");
const OfflineText = document.querySelector("#offlinetext");
const RangeBar = document.querySelector("#speed-control");
const SpeedText = document.querySelector("#speed-text");
const Submit = document.querySelector("#submit");
const HistoryE = document.querySelector("#history");
const HistoryDelete = document.querySelector("#history-delete");
const Language = document.querySelector("#language");
const OnlineIcon = document.querySelector("#online-icon");
const OfflineIcon = document.querySelector("#offline-icon");
const Search = document.querySelector("#search");
var listHistory = [];
// Get availabel voices

speechSynthesis.onvoiceschanged = function () {
  const voices = speechSynthesis.getVoices();
  console.log(voices);

  if (Array.isArray(voices)) {
    for (voice of voices) {
      const opt = document.createElement("option");
      opt.value = voice.name;
      opt.innerHTML = voice.name;
      Language.appendChild(opt);
    }
  }
};

// Get saved settings
GetLocalSetting();
// Set function
OnlineIcon.onclick = handleToggle;
OfflineIcon.onclick = handleToggle;
OnlineText.onchange = handleonChange;
OfflineText.onchange = handleonChange;
RangeBar.onchange = handleonChange;
Language.onchange = handleonChange;

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
  listHistory = [];
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
  const status = !e.target.classList.toggle("fa-volume-xmark");
  var key = "offline-speech";
  if (e.target.id === "online-icon") {
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
//search
Search.oninput = (e) => {
  const newList = listHistory.filter((i) => {
    const rootText = `[${i.time}] ${i.text}`
      .replace("{name}", i.targetName)
      .toLowerCase();
    console.log(rootText);
    return e.target.value
      .toLowerCase()
      .split(" ")
      .every((a) => rootText.includes(a));
  });
  console.log(newList);
  HistoryE.innerHTML = "";
  newList.map((e) => {
    HistoryE.innerHTML += `<p><b>[${e.time}]</b> ${e.text}</p>`.replace(
      "{name}",
      `<b style="color:#baedac">${e.targetName}</b>`
    );
  });
};
function GetLocalSetting() {
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
      OnlineText.value = result.onlinetext ?? "{name} is now online";
      OfflineText.value = result.offlinetext ?? "{name} is offline";
      Language.value =
        result.language ?? "Microsoft David - English (United States)";
      RangeBar.value = result.speed ?? 25;
      SpeedText.innerHTML = (RangeBar.value * 3) / 100;
      if (result["online-speech"] === false)
        OnlineIcon.classList.add("fa-volume-xmark");
      if (result["offline-speech"] === false)
        OfflineIcon.classList.add("fa-volume-xmark");
      listHistory = result.history ?? [];
      listHistory.map((e) => {
        HistoryE.innerHTML += `<p><b>[${e.time}]</b> ${e.text}</p>`.replace(
          "{name}",
          `<b style="color:#baedac">${e.targetName}</b>`
        );
      });
    }
  );
}
