// const url = new URL(window.location.href);

// if (url.href === "https://www.linkedin.com/") {
//     function getJobId () {
//         return new URLSearchParams(window.location.search).get("currentJobId");
//     }

//     function getJobData() {
//         const jobId = getJobId();
//         if (!jobId) return null;

//         const url = new URL(`https://www.linkedin.com/jobs/view/${jobId}`);

//         return {
//             jobId,
//             url,
//             title: url.searchParams.get("title"),
//             company: url.searchParams.get("company"),
//         };
//     }
// }