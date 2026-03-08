
const ogFetch = window.fetch
console.log('Intercepting fetch requests...')
// console.log('Original fetch:', ogFetch)
let lastSeenJobId: string | null = null

window.fetch = async function (...args) {
    // console.log('fetch request intercepted', args[0])
    const response = await ogFetch(...args)
    const url = args[0]

    if (typeof url === 'string' && url.includes('/viewjob')) {
        console.log('fetch request intercepted', url)
        const clone = response.clone()

        try {
            const html = await clone
            console.log('html', html
                .json()
                .then(
                    (res) => res.body.jobInfoWrapperModel.jobInfoModel.jobInfoHeaderModel
                )
            )
            // console.log('html', h)
            // const jobResult = html.json().then(
            //     (res) => {
            //         const body = res.body
            //         const job = body.jobInfoWrapperModel.jobInfoModel
            //         const header = job.jobInfoHeaderModel
            //         return header
            //         // body.hostQueryExecutionResult 
            //     }
            // )
            // console.log('jobResult', jobResult)
            // console.log('html', html.text())
            const urlObj = new URL(url, window.location.origin)
            const jobId = urlObj.searchParams.get('jk')
            // const companyName = jobResult.then((res) => res.companyName)
            // console.log('companyName', companyName)

            if (jobId && jobId !== lastSeenJobId) {
                console.log('Job ID:', jobId)
                console.log('Saved detected Indeed job:', jobId)
                // console.log('job data', html[0])
                // console.log('html', )
                
                lastSeenJobId = jobId
            }
        } catch (e) {

        }
    }

    return response
}

console.log('Fetch interceptor installed')
