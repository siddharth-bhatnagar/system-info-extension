const systemInfo = chrome.system;
let timeoutId;
let sysInfo = {};

// installing the sw
chrome.runtime.onInstalled.addListener(() => {
    initInfo();
    initCPU();
    initMemory();
    updateAll();
});

chrome.runtime.onSuspend.addListener(function () {
    clearTimeout(timeoutId);
});


chrome.runtime.onSuspendCanceled.addListener(function () {
    updateAll();
});

function initInfo() {
    let operatingSystem;

    if (/CrOS/.test(navigator.userAgent)) {
        operatingSystem = 'Chrome OS';
    } else if (/Mac/.test(navigator.platform)) {
        operatingSystem = 'Mac OS';
    } else if (/Win/.test(navigator.platform)) {
        operatingSystem = 'Windows';
    } else if (/Android/.test(navigator.userAgent)) {
        operatingSystem = 'Android';
    } else if (/Linux/.test(navigator.userAgent)) {
        operatingSystem = 'Linux';
    } else {
        operatingSystem = '-';
    }

    let chromeVersion = navigator.userAgent.match('Chrome/([0-9]*\.[0-9]*\.[0-9]*\.[0-9]*)')[1];
    let platform = navigator.platform.replace(/_/g, '-');
    let data = { "operatingSystem": operatingSystem, "chromeVersion": chromeVersion, "platform": platform };

    sysInfo["info"] = data;
}

function initCPU() {
    systemInfo.cpu.getInfo((cpuInfo) => {
        let cpuName = cpuInfo.modelName.replace(/\(R\)/g, '®').replace(/\(TM\)/, '™');
        let cpuArch = cpuInfo.archName.replace(/_/g, '-');
        let cpuFeatures = cpuInfo.features.join(', ').toUpperCase().replace(/_/g, '.') || '-';
        let processors = cpuInfo.processors;

        cpuUsage = [];
        for (let processor of processors) {
            cpuUsage.push(processor.usage);
        }

        let data = { "name": cpuName, "arch": cpuArch, "features": cpuFeatures, "usage": cpuUsage };
        sysInfo["cpuInfo"] = data;
    });
}

function updateCpuUsage() {
    systemInfo.cpu.getInfo((cpuInfo) => {
        const processors = cpuInfo.processors;
        let cpuUsage = [];
        for (let processor of processors) {
            cpuUsage.push(processor.usage);
        }
        sysInfo.cpuInfo.usage = cpuUsage;
    });
}

function initMemory() {
    systemInfo.memory.getInfo((memoryInfo) => {
        let capacity = bytesToMegaBytes(memoryInfo.capacity);
        let memoryUsage = bytesToMegaBytes(memoryInfo.availableCapacity);
        let data = { "capacity": capacity, "usage": memoryUsage };
        sysInfo["memory"] = data;
    });
}

function updateMemoryUsage() {
    systemInfo.memory.getInfo((memoryInfo) => {
        let memoryUsage = bytesToMegaBytes(memoryInfo.availableCapacity);
        sysInfo.memory.usage = memoryUsage;
    });
}
let key = 'info'
function updateAll() {
    updateCpuUsage();
    updateMemoryUsage();
    chrome.storage.sync.set({key: sysInfo}, () => {
        console.log(sysInfo);
    })
    timeoutId = setTimeout(updateAll, 3000);
}

function bytesToMegaBytes(number) {
    return Math.round(number / 1024 / 1024);
}