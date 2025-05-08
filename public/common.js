let uid = new Date().getTime();
let startTime = new Date().getTime();
let totalTime = 0;

function setUseId() {
  const _uid = localStorage.getItem("_uid");
  if (!_uid) {
    localStorage.setItem("_uid", uid);
  } else {
    uid = _uid;
  }
}

function fetchAddMonitor(event_type, data_json) {
  try {
    fetch("https://comic.maores.com/seriesapi/monitor", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type,
        data: data_json,
        storage_id: uid,
      }),
    });
  } catch (error) {}
}
function addMonitor(event_type, data) {
  const id = location.pathname
    .split("/")
    .filter((item) => item)
    .pop();
  if (
    location.host.includes("127.0.0.1") ||
    location.host.includes("localhost") ||
    location.search.includes("debugger=1")
  ) {
    console.log("debugger", event_type + "-series-" + id, data);
    return;
  }

  fetchAddMonitor(event_type + "-series-" + id, data);
}
function startTracking() {
  startTime = Date.now();
}
function stopTracking() {
  const timeSpent = Date.now() - startTime;
  totalTime += timeSpent;
  addMonitor("stay", { stayTime: totalTime });
}
function addEvent() {
  window.addEventListener("beforeunload", stopTracking);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startTracking();
    } else {
      stopTracking();
      addMonitor("visibilitychange", { visibilityState: document.visibilityState, stayTime: totalTime });
    }
  });
}
function load() {
  setUseId();
  addEvent();
  window.addMonitor = addMonitor;
}

load();
