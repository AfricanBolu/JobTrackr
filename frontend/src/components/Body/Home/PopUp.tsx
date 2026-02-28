import type { PopupProps } from "../../../types";


const JobConfirmationCard = ({ detectedJob, theme, onConfirm, onEdit, onDismiss }: PopupProps) => {
    const cardTheme = theme === "darkmode"
        ? "bg-slate-800 border-slate-700"
        : "bg-white border-gray-200 shadow-lg";

    const headerTheme = theme === "darkmode"
        ? "bg-blue-900/30 border-blue-700"
        : "bg-blue-50 border-blue-200";

    const textTheme = theme === "darkmode"
        ? "text-slate-400"
        : "text-gray-600";

    const labelTheme = theme === "darkmode"
        ? "text-slate-500"
        : "text-gray-500";

    const buttonPrimary = theme === "darkmode"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white";

    const buttonSecondary = theme === "darkmode"
        ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800";

    return (
        <div className={`rounded-xl border ${cardTheme} overflow-hidden`}>
            {/* Header with icon */}
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${headerTheme}`}>
                <span className="text-2xl">✨</span>
                <div>
                    <h3 className="font-semibold text-lg">Job Detected!</h3>
                    <p className="text-xs opacity-80">Did you apply to this position?</p>
                </div>
            </div>

            {/* Job details */}
            <div className="p-4 space-y-3">
                {/* Title & Company */}
                <div>
                    <h4 className="font-bold text-lg">{detectedJob.jobTitle}</h4>
                    <p className={`text-sm ${textTheme}`}>{detectedJob.companyName}</p>
                </div>

                {/* Details grid */}
                <div className="space-y-2 text-sm">
                    {detectedJob.location && (
                        <div className="flex items-start gap-2">
                            <span className={`text-xs font-medium ${labelTheme} w-20 shrink-0`}>Location:</span>
                            <span className="flex-1">{detectedJob.location}</span>
                        </div>
                    )}

                    {detectedJob.salary && (
                        <div className="flex items-start gap-2">
                            <span className={`text-xs font-medium ${labelTheme} w-20 shrink-0`}>Salary:</span>
                            <span className="flex-1">{detectedJob.salary}</span>
                        </div>
                    )}

                    <div className="flex items-start gap-2">
                        <span className={`text-xs font-medium ${labelTheme} w-20 shrink-0`}>Source:</span>
                        <span className="flex-1">{detectedJob.appliedFromName}</span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 pt-0 space-y-2">
                <button
                    onClick={onConfirm}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${buttonPrimary}`}
                >
                    ✓ Yes, I Applied
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${buttonSecondary}`}
                    >
                        Edit Details
                    </button>
                    <button
                        onClick={onDismiss}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${buttonSecondary}`}
                    >
                        Not Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobConfirmationCard;