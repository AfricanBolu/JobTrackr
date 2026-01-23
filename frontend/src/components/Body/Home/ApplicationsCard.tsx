import { useState } from "react";
import type { Application, ApplicationsProps, ApplicationStatus } from "../../../types";



const Applications = ({ applications, theme, onDelete, onStatusChange, onEdit }: ApplicationsProps) => {
    const [isOpen, setIsOpen] = useState<string | null>(null)
    // const [isUpdating, setIsUpdating] = useState<Application["syncStatus"] | "">("");

    // set theme
    // set theme
    const cardTheme =
        theme === "darkmode"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200";
    const itemTheme =
        theme === "darkmode"
            ? "bg-slate-900 border-slate-700 hover:bg-slate-700/50"
            : "bg-gray-50 border-gray-300 hover:bg-gray-100";
    const subTextTheme =
        theme === "darkmode"
            ? "text-slate-400"
            : "text-gray-600";
    const resumeTheme =
        theme === "darkmode"
            ? "bg-slate-700 border-slate-600 text-slate-300"
            : "bg-gray-200 border-gray-300 text-gray-700"

    // Helper to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return "";

        return new Date(dateString).toLocaleDateString(
            undefined, {
            month: "short", day: "numeric", year: "numeric"
        }
        );
    }

    // Helper to color code statuses
    const getStatusColor = (status: Application["jobStatus"]) => {
        switch (status) {
            case "interview":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "offer":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200"; // applied
        }
    };

    // Helper to render status dropdown
    const statusDropDown = (app: Application) => {
        const dropdownOptions: ApplicationStatus[] = ["applied", "interview", "offer", "rejected"];
        return (
            <select
                name="status"
                value={app.jobStatus}
                onChange={
                    (e) => {
                        onStatusChange(app.id, e.target.value as ApplicationStatus)
                        setIsOpen(null)
                    }
                }
                onBlur={() => setIsOpen(null)}
                title="Update Status"
                autoFocus
                className={`px-2 py-0.5 rounded text-xs font-bold border capitalize outline-none cursor-pointer ${getStatusColor(app.jobStatus)}`}
            >
                {dropdownOptions.map((s) => (
                    <option
                        value={s}
                        key={s}
                        className="bg-white text-gray-800"
                    >
                        {s}
                    </option>
                ))}
            </select>
        )
    }

    const getSyncStatus = (syncStatus: Application["syncStatus"]) => {
        switch (syncStatus) {
            case "synced":
                return {
                    icon: "✓",
                    class: "bg-green-100 text-green-700 border-green-200"
                };
            case "pending":
                return {
                    icon: "⟳",
                    class: "bg-yellow-100 text-yellow-700 border-yellow-200"
                };
            case "failed":
                return {
                    icon: "✕",
                    class: "bg-red-100 text-red-700 border-red-200"
                };
            default:
                return {
                    icon: "?",
                    class: "bg-gray-100 text-gray-700 border-gray-200"
                };
        }
    }



    return (
        <div className={`p-4 rounded-xl border ${cardTheme}`}>
            <h2 className="text-xl font-semibold mb-4">Applications</h2>

            {/* 1. Check if there are no applications */}
            {applications.length === 0 && (
                <div className={`text-center py-8 ${subTextTheme}`}>
                    No applications tracked yet.
                </div>
            )}

            <div className="flex flex-col gap-3">
                {applications.map((app) => {
                    const syncInfo = getSyncStatus(app.syncStatus)
                    return (<div
                        key={app.id}
                        className={`p-3 rounded-lg border transition-all duration-200 relative ${itemTheme}`}
                    >

                        {/* Header: Company + Date */}
                        <div
                            className="flex items-start justify-between gap-2 mb-2"
                        >
                            { /* Left: Company + Location */}
                            <div
                                className="flex-1 min-w-0"
                            >
                                <h3
                                    className="text-base font-semibold truncate"
                                >
                                    {app.companyName}
                                </h3>
                                <span
                                    className={`text-xs ${subTextTheme}`}
                                >
                                    {app.location || "Remote"}
                                </span>
                            </div>
                            { /* Right: Sync Status + Date */}
                            <div
                                className="flex flex-col items-end gap-1"
                            >
                                <span
                                    className={`px-2 py-0.5 rounded text-xs border whitespace-nowrap ${syncInfo.class}`}
                                >
                                    {syncInfo.icon}
                                </span>
                                <span
                                    className={`text-xs ${subTextTheme}`}
                                >
                                    {formatDate(app.dateApplied)}
                                </span>
                            </div>
                        </div>

                        {/* Job Title */}
                        <p
                            className="text-sm mb-3 line-clamp-2"
                        >
                            {app.jobTitle}
                        </p>

                        {/* Footer: Website, Resume, Status, Actions */}
                        <div
                            className="space-y-2"
                        >
                            <div
                                className="flex items-center justify-between gap-2 text-xs"
                            >
                                {/* Website Link */}
                                <div
                                    className="shrink-0 min-w-0"
                                >
                                    {app.appliedFromUrl && (
                                        <a
                                            href={app.appliedFromUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-500 hover:underline font-medium"
                                        >
                                            {app.appliedFromName || "Website"}
                                        </a>
                                    )}
                                </div>

                                {/* Resume Badge */}
                                <div
                                    className="flex-1 flex justify-center min-w-0"
                                >
                                    {app.resumeRef && (
                                        <span
                                            className={`px-2 py-0.5 rounded border truncate max-w-30 inline-block align-middle ${resumeTheme}`}
                                        >
                                            📄 {app.resumeRef}
                                        </span>
                                    )}
                                </div>

                                {/* Status Dropdown */}
                                <div
                                    className="shrink-0 flex justify-end min-w-20"
                                >
                                    {
                                        isOpen === app.id ? (
                                            statusDropDown(app)
                                        ) : (
                                            <span
                                                className={`px-2 py-0.5 rounded border capitalize cursor-pointer whitespace-nowrap ${getStatusColor(app.jobStatus)}`}
                                                onClick={() => setIsOpen(app.id)}
                                            >
                                                {app.jobStatus}
                                            </span>
                                        )}
                                </div>
                            </div>
                            { /* Edit + Delete Buttons */}
                            <div
                                className="flex justify-between items-center text-xs"
                            >
                                <button
                                    onClick={() => { onEdit(app) }}
                                    className="px-2 py-1 text-xs hover:text-blue-500 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { onDelete(app.id) }}
                                    className="px-2 py-1 text-xs hover:text-red-500 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Applications