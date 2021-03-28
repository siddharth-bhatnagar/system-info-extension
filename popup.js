import { updateCpuUsage, updateMemoryUsage } from "./main.js";
let button = document.getElementById("btn");
let sysInfo = {};
chrome.storage.sync.get(['key'], (object) => {
    sysInfo = object;
    console.log(sysInfo);
});
button.addEventListener("click", async () => {
    console.log(sysInfo);
    sysInfo.key.cpuInfo.usage = updateCpuUsage();
    sysInfo.key.memory.usage = updateMemoryUsage();
    // updating in storage
    chrome.storage.sync.set({ 'key': sysInfo }, () => console.log("Saved", sysInfo));
});