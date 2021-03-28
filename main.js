const systemInfo = chrome.system;

function updateCpuUsage() {
    systemInfo.cpu.getInfo((cpuInfo) => {
        const processors = cpuInfo.processors;
        let cpuUsage = [];
        for (let processor of processors) {
            cpuUsage.push(processor.usage);
        }
        return cpuUsage;
    });
}

function updateMemoryUsage() {
    systemInfo.memory.getInfo((memoryInfo) => {
        let memoryUsage = bytesToMegaBytes(memoryInfo.availableCapacity);
        return memoryUsage;
    });
}

function bytesToMegaBytes(number) {
    return Math.round(number / 1024 / 1024);
}

export { updateCpuUsage, updateMemoryUsage };
