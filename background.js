const systemInfo = chrome.system;

chrome.runtime.onMessageExternal.addListener(async function (request, sender, sendResponse) {
    console.log(request, sender);
    const data = await fetchData();
    console.log(data);
    sendResponse(data);
});

const fetchData = () => {
    return new Promise(async (resolve, reject) => {
        const info = await initInfo();
        const cpu = await initCpu();
        const memory = await initMemory(); 
        let payload = {
            "info": info,
            "cpuInfo": cpu,
            "memory": memory
        }
        resolve(payload);
    });
};

const initInfo = () => {
    return new Promise((res) => {
        let operatingSystem;
        let chromeVersion = navigator.userAgent.match('Chrome/([0-9]*\.[0-9]*\.[0-9]*\.[0-9]*)')[1];
        let platform = navigator.platform.replace(/_/g, '-');

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

        let data = { "operatingSystem": operatingSystem, "chromeVersion": chromeVersion, "platform": platform };
        res(data);
    });
}

const initCpu = () => {
    return new Promise((res) => {
        systemInfo.cpu.getInfo(async (cpuInfo) => {
            let cpuName = await cpuInfo.modelName.replace(/\(R\)/g, '®').replace(/\(TM\)/, '™');
            let cpuArch = await cpuInfo.archName.replace(/_/g, '-');
            let cpuFeatures = await cpuInfo.features.join(', ').toUpperCase().replace(/_/g, '.') || '-';
            let processors = await cpuInfo.processors;

            cpuUsage = [];
            for (let processor of processors) {
                await cpuUsage.push(processor.usage);
            }

            let data = { "name": cpuName, "arch": cpuArch, "features": cpuFeatures, "usage": cpuUsage };

            res(data);
        });
    });
}

const initMemory = () => {
    return new Promise((res) => {
        systemInfo.memory.getInfo((memoryInfo) => {
            let capacity = bytesToMegaBytes(memoryInfo.capacity);
            let memoryUsage = bytesToMegaBytes(memoryInfo.availableCapacity);
            let data = { "capacity": capacity, "usage": memoryUsage };
            
            res(data);
        });
    });
}

function bytesToMegaBytes(number) {
    return Math.round(number / 1024 / 1024);
}







