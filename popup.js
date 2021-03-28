import { updateCpuUsage, updateMemoryUsage } from "./main.js";
let button = document.getElementById("btn");
let sysInfo = {};

chrome.storage.sync.get("info", (object) => {
    sysInfo = object;
    console.log(sysInfo);
});

button.addEventListener("click", async () => {
    sysInfo.cpuInfo.usage = updateCpuUsage();
    sysInfo.memory.usage = updateMemoryUsage();
    // updating in storage
    chrome.storage.sync.set({ 'info': sysInfo }, () => console.log("Saved"));
});