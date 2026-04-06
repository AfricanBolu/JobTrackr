/** @format */

const url = new URL(window.location.href)

// debugging
// console.log('🚀 Content script executing at:', document.readyState)
// console.log('🚀 URL:', window.location.href)

// Linkedin Job posting
// if (url.hostname.includes('linkedin.com')) {
//     let lastSeenJobId: string | null = null
//     let pendingTimer: number | null = null

//     function getCurrentJobId(): string | null {
//         return new URLSearchParams(window.location.search).get('currentJobId')
//     }

//     function extractLinkedInJobData() {
//         const jobId = getCurrentJobId()
//         if (!jobId) return null

//         const titleEl = document.querySelector(
//             '.job-details-jobs-unified-top-card__job-title',
//         )

//         const companyEl = document.querySelector(
//             '.job-details-jobs-unified-top-card__company-name',
//         )

//         // Don’t save until core DOM is actually present
//         const jobTitle = titleEl?.textContent?.trim() || ''
//         const companyName = companyEl?.textContent?.trim() || ''

//         if (!jobTitle || !companyName) return null

//         const locationContainer = document.querySelector(
//             '.job-details-jobs-unified-top-card__primary-description-container',
//         )

//         const salaryContainer = document.querySelector(
//             '.job-details-fit-level-preferences',
//         )

//         const canonicalUrl = `https://www.linkedin.com/jobs/view/${jobId}`

//         return {
//             id: jobId,
//             jobId,
//             jobTitle,
//             companyName,
//             appliedFromUrl: canonicalUrl,
//             appliedFromName: 'LinkedIn',
//             location:
//                 (
//                     locationContainer?.querySelector(
//                         'span > span',
//                     ) as HTMLElement
//                 )?.innerText?.trim() || '',
//             salary:
//                 (
//                     salaryContainer?.querySelector(
//                         'span > strong',
//                     ) as HTMLElement
//                 )?.innerText?.trim() || '',
//             dateApplied: new Date().toISOString(),
//             jobStatus: 'applied',
//             syncStatus: 'pending',
//         }
//     }

//     function saveIfNewJob() {
//         const currentJobId = getCurrentJobId()
//         if (!currentJobId) return

//         // If same job id, still allow a retry in case DOM wasn’t ready before
//         const jobData = extractLinkedInJobData()
//         if (!jobData) return

//         // Prevent redundant writes once it succeeds
//         if (lastSeenJobId === currentJobId) return

//         lastSeenJobId = currentJobId
//         chrome.storage.local.set({ detectedJob: jobData })
//         console.log('Saved detected LinkedIn job:', jobData)
//     }

//     function scheduleCheck() {
//         if (pendingTimer) window.clearTimeout(pendingTimer)

//         // Give LinkedIn time to render the right pane
//         pendingTimer = window.setTimeout(() => {
//             saveIfNewJob()
//         }, 900)
//     }

//     function patchHistoryMethod(method: 'pushState' | 'replaceState') {
//         const original = history[method]

//         history[method] = function (
//             this: History,
//             ...args: Parameters<History[typeof method]>
//         ) {
//             const result = original.apply(this, args)
//             scheduleCheck()
//             return result
//         } as History[typeof method]
//     }

//     patchHistoryMethod('pushState')
//     patchHistoryMethod('replaceState')

//     window.addEventListener('popstate', scheduleCheck)

//     // Observe DOM changes because LinkedIn may update pane without a clean history event
//     const observer = new MutationObserver(() => {
//         const currentJobId = getCurrentJobId()
//         if (!currentJobId) return

//         // Only care if the selected job may have changed
//         if (currentJobId !== lastSeenJobId) {
//             scheduleCheck()
//         }
//     })

//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//     })

//     // Initial attempt on page load
//     scheduleCheck()
// }
function injectScript() {
    if (document.querySelector('script[data-jobtrackr-inject]')) return

    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('inject.js')
    script.dataset.jobtrackrInject = 'true'
    script.onload = () => script.remove()
    ;(document.head || document.documentElement).appendChild(script)
}

if (
    document.querySelectorAll('script[type="application/ld+json"]').length > 0
) {
    console.log('Detected job posting schema - extracting job data')
} else if (url.hostname.includes('glassdoor.com')) {
    injectScript()

    window.addEventListener('message', (event) => {
        if (event.data?.source !== 'JOB_TRACKR_INJECT') return

        const { jobTitle, companyName, location, appliedFromUrl, jobId } =
            event.data

        setTimeout(() => {
            let salary = ''

            const salaryContainer = document.querySelector(
                '#PaySection_salaryRange_F6fsy',
            )

            if (salaryContainer) {
                salary = salaryContainer.textContent?.trim() || ''
            }

            // console.log('Received job data from inject script:', {
            //     jobTitle,
            //     companyName,
            //     location,
            //     appliedFromUrl,
            //     jobId,
            //     salary,
            // })

            const application = {
                id: crypto.randomUUID(),
                jobTitle: jobTitle,
                companyName: companyName,
                location: location,
                salary: salary,
                appliedFromName: 'Glassdoor',
                dateApplied: new Date().toISOString(),
                jobStatus: 'applied',
                syncStatus: 'pending',
                appliedFromUrl: appliedFromUrl,
                jobId: jobId,
            }

            chrome.storage.local.set({ detectedJob: application }, () => {
                console.log(
                    'JobTrackr: Saved detected Glassdoor job:',
                    application,
                )
            })
        }, 300)
    })
} else if (url.hostname.includes('indeed.com')) {
    injectScript()

    // let lastSeenJobId: string | null = null
    window.addEventListener('message', (event) => {
        if (event.data?.source !== 'JOB_TRACKR_INJECT') return

        const { jobTitle, companyName, location, appliedFromUrl, jobId } =
            event.data

        setTimeout(() => {
            let salary = ''

            const salaryContainer = document.querySelector(
                '#salaryInfoAndJobType > span.css-1oc7tea.eu4oa1w0',
            )

            if (salaryContainer) {
                salary =
                    salaryContainer.textContent
                        ?.trim()
                        .replace(/^From\s+/i, '') || ''
            }

            const application = {
                id: crypto.randomUUID(),
                jobTitle: jobTitle,
                companyName: companyName,
                location: location,
                salary: salary,
                appliedFromName: 'Indeed',
                dateApplied: new Date().toISOString(),
                jobStatus: 'applied',
                syncStatus: 'pending',
                appliedFromUrl: appliedFromUrl,
                jobId: jobId,
            }

            chrome.storage.local.set({ detectedJob: application }, () => {
                console.log(
                    'JobTrackr: Saved detected Indeed job:',
                    application,
                )
            })
        }, 300)
    })
}
