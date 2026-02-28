/** @format */

const url = new URL(window.location.href);

if (url.hostname.includes("linkedin.com")) {
	// Install the interceptor first
	const originalPushState = history.pushState;
	history.pushState = function (...args) {
		// Call original
		const result = originalPushState.apply(this, args);

		// After URL changes, extract job data
		setTimeout(() => {
			const jobData = getJobData();
			if (jobData) {
				chrome.storage.local.set({ detectedJob: jobData });
			}
		}, 500); // Small delay to let DOM update

		return result;
	};

	function getJobData() {
		function getJobId() {
			return new URLSearchParams(window.location.search).get("currentJobId");
		}
		const jobId = getJobId();
		if (!jobId) return null;

		const url = new URL(`https://www.linkedin.com/jobs/view/${jobId}`);
		const locationContainer = document.querySelector(
			".job-details-jobs-unified-top-card__primary-description-container",
		);
		const salaryContainer = document.querySelector(".job-details-fit-level-preferences");

		return {
			jobId,
			url,
			title: document
				.querySelector(".job-details-jobs-unified-top-card__company-name")
				?.textContent?.trim(),
			company: document
				.querySelector(".job-details-jobs-unified-top-card__job-title")
				?.textContent?.trim(),
			location: (
				locationContainer?.querySelector("span > span") as HTMLElement
			)?.innerText.trim(),
			salary: (
				salaryContainer?.querySelector("span > strong") as HTMLElement
			)?.innerText.trim(),
			websiteName: "LinkedIn",
		};
	}
	const jobData = getJobData();
	if (jobData) {
		chrome.storage.local.set({ detectedJob: jobData });
	}
}

if (url.hostname.includes("indeed.com")) {
	// Install the interceptor first
	const originalPushState = history.pushState;
	history.pushState = function (...args) {
		// Call original
		const result = originalPushState.apply(this, args);

		// After URL changes, extract job data
		setTimeout(() => {
			const jobData = getJobData();
			if (jobData) {
				chrome.storage.local.set({ detectedJob: jobData });
			}
		}, 500); // Small delay to let DOM update

		return result;
	};

	function getJobData() {
		// function to get the job id from url
		function getJobId() {
			return new URLSearchParams(window.location.search).get("vjk");
		}

		// get ID and check if it exists
		const jobId = getJobId();
		if (!jobId) return null;

		// extract job data
		const url = new URL(`http://www.indeed.com/viewjob?jk=${jobId}`);

		// job type, used to get the salary type and range
		// const jobType = document
		// 	.querySelector("#salaryInfoAndJobType > span.css-1u1g3ig")
		// 	?.textContent.trim();
		// selector to selects specific tag for salary
		const salaryContainer = document.querySelector(
			"#salaryInfoAndJobType > span.css-1oc7tea.eu4oa1w0",
		);

		// return job data extracted to pass into storage
		return {
			jobId,
			url,
			title: document.querySelector("h1>span")?.textContent,
			company: document.querySelector('[data-company-name="true"]')?.textContent?.trim(),
			location: document.querySelector("[data-testid=job-location]")?.textContent.trim(),
			// salary:
			// 	jobType === "Full-time"
			// 		? salaryContainer?.textContent?.trim().replace(/\s+a year$/i, "")
			// 		: salaryContainer?.textContent?.trim().match(/\d+/)?.[0],
			salary: salaryContainer?.textContent?.trim().replace(/^From\s+/i, ""),
			websiteName: "Indeed",
		};
	}
	const jobData = getJobData();
	// save job data to local storage
	if (jobData) {
		chrome.storage.local.set({ detectedJob: jobData });
	}
}
