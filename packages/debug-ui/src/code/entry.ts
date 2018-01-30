import { Civil } from "@joincivil/core";

// Metamask is injected after full load
window.addEventListener("load", () => {
    const civil = new Civil();
    console.log(civil);
});
