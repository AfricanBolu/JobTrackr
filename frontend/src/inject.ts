/** @format */

const hostname = window.location.hostname;

if(hostname.includes('indeed.com')) {
const ogFetch = window.fetch;
// console.log("Intercepting fetch requests...");
// console.log('Original fetch:', ogFetch)
let lastSeenJobId: string | null = null;


	
window.fetch = async function (...args) {
	// console.log('fetch request intercepted', args[0])
	const response = await ogFetch(...args);
	const url = args[0];

	if (typeof url === "string" && url.includes("/viewjob")) {
		console.log("fetch request intercepted", url);
		const clone = response.clone();

		try {
			const data = await clone;
			// console.log(
			// 	"html",
			// 	html
			// 		.json()
			// 		.then((res) => res.body.jobInfoWrapperModel.jobInfoModel.jobInfoHeaderModel),
			// );
			const res = await data.json();
			const jobInfo = res.body?.jobInfoWrapperModel.jobInfoModel?.jobInfoHeaderModel;
			
			const urlObj = new URL(url, window.location.origin);
			const jobId = urlObj.searchParams.get("jk");
			// const companyName = jobResult.then((res) => res.companyName)
			// console.log('companyName', companyName)

			if (jobId && jobId !== lastSeenJobId) {
				// console.log("Job ID:", jobId);
				console.log("Saved detected Indeed job:", jobId);
				// console.log('job data', html[0])
				// console.log('html', )
				// console.log("jobInfo", jobInfo);
				// console.log("companyName", companyName);
				// console.log("jobTitle", jobTitle);
				// console.log("location", location);
				window.postMessage({
					source: "JOB_TRACKR_INJECT",
					companyName: jobInfo?.companyName,
					jobTitle: jobInfo?.jobTitle,
					location: jobInfo?.remoteWorkModel?.text || jobInfo?.formattedLocation || "No location found",
					appliedFromUrl: 'https://indeed.com/viewjob?jk=${jobId}',
					jobId: jobId,
				}, "*");

				lastSeenJobId = jobId;
			}
		} catch (e) {
			console.error("Failed to parse Indeed response HTML", e);
		}
	}

	return response;
};

console.log("Fetch interceptor installed");

}