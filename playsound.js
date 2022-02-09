var listRequest = [];
var loading = false;
chrome.runtime.onMessage.addListener(async (request) => {
  listRequest.push(request.toSay);
  console.log(listRequest);
  if (!loading) PlaySound(listRequest, request.speed, request.language);
});
function PlaySound(listText, speed, language) {
  if (listText.length > 0) {
    loading = true;
    const Textspeech = listText[0];
    chrome.tts.speak(Textspeech, {
      rate: (speed * 3) / 100,
      voiceName: language,
      onEvent: function (event) {
        if (event.type === "end") {
          console.log("Speech ended. " + listText.shift());

          console.log(listText);
          loading = false;
          PlaySound(listText, speed, language);
        }
      },
    });
  }
}
// chrome.storage.local.clear();
