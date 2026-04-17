import { useState } from 'react'
import type {
    Application,
    ApplicationsProps,
    ApplicationStatus,
} from '../../../types'

const Applications = ({
    applications,
    onDelete,
    onStatusChange,
    onEdit,
}: ApplicationsProps) => {
    const [isOpen, setIsOpen] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    // const [isUpdating, setIsUpdating] = useState<Application["syncStatus"] | "">("");

    // set theme
    // set theme
    const cardTheme = 'bg-slate-800 border-slate-700'
    const itemTheme = 'bg-slate-900 border-slate-700 hover:bg-slate-700/50'
    const subTextTheme = 'text-slate-400'
    const inputTheme = 'border-stone-600 bg-slate-800 text-stone-200'
    // const resumeTheme =
    //     theme === "darkmode"
    //         ? "bg-slate-700 border-slate-600 text-slate-300"
    //         : "bg-gray-200 border-gray-300 text-gray-700"

    // Helper to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return ''

        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        })
    }

    // Helper to color code statuses
    const getStatusColor = (status: Application['jobStatus']) => {
        switch (status) {
            case 'interview':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'offer':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200'
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200' // applied
        }
    }

    // Helper to render status dropdown
    const statusDropDown = (app: Application) => {
        const dropdownOptions: ApplicationStatus[] = [
            'applied',
            'interview',
            'offer',
            'rejected',
        ]
        return (
            <select
                name="status"
                value={app.jobStatus}
                onChange={(e) => {
                    onStatusChange(app.id, e.target.value as ApplicationStatus)
                    setIsOpen(null)
                }}
                onBlur={() => setIsOpen(null)}
                title="Update Status"
                autoFocus
                className={`px-2 py-0.5 rounded text-xs font-medium border capitalize outline-none cursor-pointer ${getStatusColor(app.jobStatus)}`}
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

    const getSyncStatus = (syncStatus: Application['syncStatus']) => {
        switch (syncStatus) {
            case 'synced':
                return {
                    icon: '✓',
                    class: 'bg-green-100 text-green-700 border-green-200',
                }
            case 'pending':
                return {
                    icon: '⟳',
                    class: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                }
            case 'failed':
                return {
                    icon: '✕',
                    class: 'bg-red-100 text-red-700 border-red-200',
                }
            default:
                return {
                    icon: '?',
                    class: 'bg-gray-100 text-gray-700 border-gray-200',
                }
        }
    }

    const searchApplications = applications.filter((app) => {
        const search = searchTerm.toLowerCase()
        return (
            app.jobTitle.toLowerCase().includes(search) ||
            app.companyName.toLowerCase().includes(search) ||
            app.location?.toLowerCase().includes(search) ||
            app.appliedFromName?.toLowerCase().includes(search) ||
            app.jobStatus.toLowerCase().includes(search)
        )
    })

    return (
        <div className={`h-full flex flex-col rounded-xl border ${cardTheme}`}>
            <div className="p-3 pb-2 shrink-0">
                <h2 className="text-xl font-semibold">Applications</h2>
            </div>
            <div className="px-3 pb-2 shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputTheme}`}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            x
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 min-h-0">
                {/* 1. Check if there are no applications */}
                {applications.length === 0 && (
                    <div className={`text-center py-8 ${subTextTheme}`}>
                        No applications tracked yet.
                    </div>
                )}

                {/* chek if search returns no results */}
                {applications.length > 0 && searchApplications.length === 0 && (
                    <div className={`text-center py-8 ${subTextTheme}`}>
                        No results found for "{searchTerm}".
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    {searchApplications.map((app) => {
                        const syncInfo = getSyncStatus(app.syncStatus)
                        return (
                            <div
                                key={app.id}
                                className={`p-2 rounded-lg border transition-all ${itemTheme}`}
                            >
                                {/* Header: Job Title + Company + Status + Date */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    {/* Left: Job Title + Company */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold truncate">
                                            {app.jobTitle}
                                        </h3>
                                        {/* Job Title */}
                                        <p className="text-xs truncate">
                                            {app.companyName}
                                        </p>
                                    </div>

                                    {/* Right: Status + Date Applied */}
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        {/* Status Dropdown */}
                                        <div className="flex items-center">
                                            {isOpen === app.id ? (
                                                statusDropDown(app)
                                            ) : (
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-medium border capitalize cursor-pointer ${getStatusColor(app.jobStatus)}`}
                                                    onClick={() =>
                                                        setIsOpen(app.id)
                                                    }
                                                >
                                                    {app.jobStatus}
                                                </span>
                                            )}
                                        </div>
                                        {/* Date Applied */}
                                        <span
                                            className={`text-xs ${subTextTheme}`}
                                        >
                                            {formatDate(app.dateApplied)}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer: Website, Resume, Status, Actions */}
                                <div className="flex items-center justify-between text-xs">
                                    {/* Edit + Delete Buttons */}
                                    <button
                                        onClick={() => {
                                            onEdit(app)
                                        }}
                                        className="px-2 py-1 hover:text-blue-500 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    {/* Right: Sync Status + Date */}
                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs border ${syncInfo.class}`}
                                        >
                                            {syncInfo.icon}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onDelete(app.id)
                                        }}
                                        className="px-2 py-1 hover:text-red-500 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Applications
