/** @format */

const url = new URL(window.location.href)

// debugging
// console.log('🚀 Content script executing at:', document.readyState)
// console.log('🚀 URL:', window.location.href)

// Linkedin Job posting
if (url.hostname.includes('linkedin.com')) {
    let lastSeenJobId: string | null = null
    let pendingTimer: number | null = null

    function getCurrentJobId(): string | null {
        return new URLSearchParams(window.location.search).get('currentJobId')
    }

    function extractLinkedInJobData() {
        const jobId = getCurrentJobId()
        if (!jobId) return null

        const titleEl = document.querySelector(
            '.job-details-jobs-unified-top-card__job-title',
        )

        const companyEl = document.querySelector(
            '.job-details-jobs-unified-top-card__company-name',
        )

        // Don’t save until core DOM is actually present
        const jobTitle = titleEl?.textContent?.trim() || ''
        const companyName = companyEl?.textContent?.trim() || ''

        if (!jobTitle || !companyName) return null

        const locationContainer = document.querySelector(
            '.job-details-jobs-unified-top-card__primary-description-container',
        )

        const salaryContainer = document.querySelector(
            '.job-details-fit-level-preferences',
        )

        const canonicalUrl = `https://www.linkedin.com/jobs/view/${jobId}`

        return {
            id: jobId,
            jobId,
            jobTitle,
            companyName,
            appliedFromUrl: canonicalUrl,
            appliedFromName: 'LinkedIn',
            location:
                (
                    locationContainer?.querySelector(
                        'span > span',
                    ) as HTMLElement
                )?.innerText?.trim() || '',
            salary:
                (
                    salaryContainer?.querySelector(
                        'span > strong',
                    ) as HTMLElement
                )?.innerText?.trim() || '',
            dateApplied: new Date().toISOString(),
            jobStatus: 'applied',
            syncStatus: 'pending',
        }
    }

    function saveIfNewJob() {
        const currentJobId = getCurrentJobId()
        if (!currentJobId) return

        // If same job id, still allow a retry in case DOM wasn’t ready before
        const jobData = extractLinkedInJobData()
        if (!jobData) return

        // Prevent redundant writes once it succeeds
        if (lastSeenJobId === currentJobId) return

        lastSeenJobId = currentJobId
        chrome.storage.local.set({ detectedJob: jobData })
        console.log('Saved detected LinkedIn job:', jobData)
    }

    function scheduleCheck() {
        if (pendingTimer) window.clearTimeout(pendingTimer)

        // Give LinkedIn time to render the right pane
        pendingTimer = window.setTimeout(() => {
            saveIfNewJob()
        }, 900)
    }

    function patchHistoryMethod(method: 'pushState' | 'replaceState') {
        const original = history[method]

        history[method] = function (
            this: History,
            ...args: Parameters<History[typeof method]>
        ) {
            const result = original.apply(this, args)
            scheduleCheck()
            return result
        } as History[typeof method]
    }

    patchHistoryMethod('pushState')
    patchHistoryMethod('replaceState')

    window.addEventListener('popstate', scheduleCheck)

    // Observe DOM changes because LinkedIn may update pane without a clean history event
    const observer = new MutationObserver(() => {
        const currentJobId = getCurrentJobId()
        if (!currentJobId) return

        // Only care if the selected job may have changed
        if (currentJobId !== lastSeenJobId) {
            scheduleCheck()
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })

    // Initial attempt on page load
    scheduleCheck()
}

// Indeed Job posting
// if (url.hostname.includes('indeed.com')) {
//     // function to get the job id from url
//     // function getJobId() {
//     //     return new URLSearchParams(window.location.search).get('vjk')
//     // }

//     //debugging
//     // console.log('Indeed content script loaded!')
//     // console.log('Current URL:', window.location.href)
//     // console.log(
//     //     'Job ID:',
//     //     new URLSearchParams(window.location.search).get('vjk'),
//     // )

//     let lastSeenJobId: string | null = null

//     // function getJobData() {
//     //     // get ID and check if it exists
//     //     const jobId = getJobId()
//     //     if (!jobId) return null

//     //     // extract job data
//     //     const url = new URL(`https://www.indeed.com/viewjob?jk=${jobId}`)

//     //     // job type, used to get the salary type and range
//     //     // const jobType = document
//     //     // 	.querySelector("#salaryInfoAndJobType > span.css-1u1g3ig")
//     //     // ?.textContent.trim();
//     //     // selector to selects specific tag for salary
//     //     const salaryContainer = document.querySelector(
//     //         '#salaryInfoAndJobType > span.css-1oc7tea.eu4oa1w0',
//     //     )

//     //     // return job data extracted to pass into storage
//     //     return {
//     //         id: jobId, // Changed to match "id" check
//     //         jobId: jobId,
//     //         appliedFromUrl: url.toString(), // Mapped properly
//     //         jobTitle: document.querySelector('.jobsearch-JobInfoHeader-title')?.textContent?.trim() || '', // Mapped properly
//     //         companyName:
//     //             document
//     //                 .querySelector('[data-company-name="true"]')
//     //                 ?.textContent?.trim() || '', // Mapped properly
//     //         location: document
//     //             .querySelector('[data-testid=job-location]')
//     //             ?.textContent?.trim(),
//     //         salary: salaryContainer?.textContent
//     //             ?.trim()
//     //             .replace(/^From\s+/i, ''),
//     //         appliedFromName: 'Indeed', // Mapped properly
//     //         // Default required Application fields
//     //         dateApplied: new Date().toISOString(),
//     //         jobStatus: 'applied',
//     //         syncStatus: 'pending',
//     //     }
//     //     // console.log("Job Data:", getJobData());
//     // }
//     // console.log('Job Data:', getJobData())

//     // function checkAndSaveJob() {
//     //     const jobId = getJobId()

//     //     if (jobId && jobId !== lastSeenJobId) {
//     //         setTimeout(() => {
//     //             const jobData = getJobData()
//     //             if (jobData) {
//     //                 console.log('Saved detected Indeed job:', jobData)
//     //                 chrome.storage.local.set({ detectedJob: jobData })
//     //                 lastSeenJobId = jobId
//     //             }
//     //         }, 500)
//     //     }
//     // }

//     // intercept fetch requests about job
// 	const originalFetch = window.fetch
// 	console.log('Intercepting fetch requests...')
// 	console.log('Original fetch:', originalFetch)
	
// 	window.fetch = async function(...args) {
// 		console.log('Intercepted fetch request...')
// 		const response = await originalFetch(...args);
// 		const url = args[0]

// 		if(typeof url === 'string' && url.includes('/viewjob')) {
// 			console.log('intercepted url')
// 			const clone = response.clone()

// 			try {
// 				const html = await clone.text()
// 				console.log('Response HTML:', html)

// 				const urlObj = new URL(url, window.location.origin)
// 				const jobId = urlObj.searchParams.get('jk')

// 				if(jobId && jobId !== lastSeenJobId) {
// 					console.log('Job ID:', jobId)
// 					console.log('Saved detected Indeed job:', jobId)
// 					lastSeenJobId = jobId
// 				}
// 			} catch (e) {
// 				console.error('Failed to parse Indeed response HTML', e)
// 			}
// 			// checkAndSaveJob()
// 		}

// 		return response
// 	}
// }

if(url.hostname.includes('indeed.com')) {
	console.log("Injecting interceptor from content script...")

	const script = document.createElement('script')
	script.src = chrome.runtime.getURL('inject.js')

	script.onload = () => {
		script.remove()
	}

	(document.head || document.documentElement).appendChild(script)
	
	// let lastSeenJobId: string | null = null

	
}