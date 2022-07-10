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
(async function CheckIfEdge() {
  const isChrome = navigator.userAgent.indexOf("Chrome") != -1;
  const isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;
  const voices = await chrome.tts.getVoices();
  console.log("Voice in playsound.js: ");
  console.log(voices);
  if (isEdgeChromium && voices && voices.length < 27) {
    PlaySound([""], 25, voices[4].voiceName);
    console.log("Updated voices");
    chrome.runtime.reload();
  }
})();
