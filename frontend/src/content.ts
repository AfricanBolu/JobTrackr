const url = new URL(window.location.href);

if (url.hostname.includes("linkedin.com")) {
    function getJobData() {
        function getJobId () {
            return new URLSearchParams(window.location.search).get("currentJobId");
        }
        const jobId = getJobId();
        if (!jobId) return null;

        const url = new URL(`https://www.linkedin.com/jobs/view/${jobId}`);
        const locationContainer =  document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
        const salaryContainer = document.querySelector('.job-details-fit-level-preferences');


        return {
            jobId,
            url,
            title: document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim(),
            company: document.querySelector('.job-details-jobs-unified-top-card__job-title')?.textContent?.trim(),
            location: (locationContainer?.querySelector('span > span') as HTMLElement)?.innerText.trim(),
            salary: (salaryContainer?.querySelector('span > strong') as HTMLElement)?.innerText.trim(),
            websiteName: "LinkedIn",
        };
    }
    const jobData = getJobData();
    if(jobData) {
        chrome.storage.local.set({detectedJobs: jobData});
    }
}

if(url.hostname.includes("indeed.com")) {
    function getJobData() {
        function getJobId () {
            return new URLSearchParams(window.location.search).get("currentJobId");
        }
        const jobId = getJobId();
        if (!jobId) return null;

        const url = new URL(`https://www.linkedin.com/jobs/view/${jobId}`);
        const locationContainer =  document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
        const salaryContainer = document.querySelector('.job-details-fit-level-preferences');


        return {
            jobId,
            url,
            title: document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim(),
            company: document.querySelector('.job-details-jobs-unified-top-card__job-title')?.textContent?.trim(),
            location: (locationContainer?.querySelector('span > span') as HTMLElement)?.innerText.trim(),
            salary: (salaryContainer?.querySelector('span > strong') as HTMLElement)?.innerText.trim(),
            websiteName: "LinkedIn",
        };
    }
    const jobData = getJobData();
    if(jobData) {
        chrome.storage.local.set({detectedJobs: jobData});
    }
}