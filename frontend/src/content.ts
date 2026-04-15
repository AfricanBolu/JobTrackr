/** @format */

const url = new URL(window.location.href)

function injectScript() {
    if (document.querySelector('script[data-jobtrackr-inject]')) return

    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('inject.js')
    script.dataset.jobtrackrInject = 'true'
    script.onload = () => script.remove()
    ;(document.head || document.documentElement).appendChild(script)
}
const scriptTags = document.querySelectorAll(
    'script[type="application/ld+json"]',
)

if (scriptTags.length > 0) {
    const details = Array.from(scriptTags).map((s) => JSON.parse(s.innerHTML))
    const jobDetails = details.find((d) => d['@type'] === 'JobPosting')

    if (jobDetails) {
        const locationSource = Array.isArray(jobDetails.jobLocation)
            ? jobDetails.jobLocation[0]
            : jobDetails.jobLocation

        const locationCity = locationSource?.address?.addressLocality || ''
        const locationState = locationSource?.address?.addressRegion || ''
        const location = [locationCity, locationState]
            .filter(Boolean)
            .join(', ')

        const baseSalary = jobDetails.baseSalary?.value
        let salary = ''

        if (baseSalary?.value) {
            salary = `$${baseSalary.value}${baseSalary.unitText ? ` per ${baseSalary.unitText.toLowerCase()}` : ''}`
        } else if (baseSalary?.minValue && baseSalary?.maxValue) {
            salary = `$${baseSalary.minValue} - $${baseSalary.maxValue}${baseSalary.unitText ? ` per ${baseSalary.unitText.toLowerCase()}` : ''}`
        } else {
            const patterns = [
                /\$\d{1,3}(,\d{3})*(\.\d+)?\s*-\s*\$\d{1,3}(,\d{3})*(\.\d+)?/,
                /\$\d{1,3}(,\d{3})*(\.\d+)?\s*per\s*(year|month|week|day|hour)/i,
                /\$\d{1,3}(,\d{3})*(\.\d+)?(\/hour)?/,
                /\b\d{1,3}(,\d{3})*(\.\d+)?\s*(USD|EUR|GBP|CAD|AUD)\b/i,
            ]

            const textContent =
                new DOMParser().parseFromString(
                    jobDetails.description || '',
                    'text/html',
                ).body.textContent || ''

            for (const pattern of patterns) {
                const match = textContent.match(pattern)
                if (match) {
                    salary = match[0]
                    break
                }
            }
        }

        const application = {
            id: crypto.randomUUID(),
            jobTitle: jobDetails.title || '',
            companyName: jobDetails.hiringOrganization?.name || '',
            location,
            salary,
            appliedFromName: jobDetails.hiringOrganization?.name || '',
            appliedFromUrl: jobDetails.url || window.location.href,
        }

        chrome.storage.local.set({ detectedJob: application }, () => {
            console.log(
                'JobTrackr: Saved detected job from JSON-LD:',
                application,
            )
        })
    }
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
