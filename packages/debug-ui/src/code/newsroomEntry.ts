import { setNewsroomListeners } from "./listeners";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  setNewsroomListeners();
});
