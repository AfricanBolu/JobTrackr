import type { StatsData, ThemeProps } from "../../../types";

interface StatsProps extends ThemeProps {
    stats: StatsData
}
const Stats = ({ stats, theme }: StatsProps) => {
    const cardTheme = theme === "darkmode" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-sm";
    return (
        <div className={`p-4 rounded-2xl border ${cardTheme}`}>
            <h2 className="text-xl font-semibold">
                Quick Stats
            </h2>
            <div className="flex justify-center items-center gap-2">
                <div className="flex-1 flex flex-col items-center p-4 rounded-2xl shadow-xl/20 inset-shadow-sm">
                    <h3 className="text-3xl font-bold">
                        {stats.totalApplications}
                    </h3>
                    <span className="text-sm font-medium">
                        Total Jobs
                    </span>
                </div>
                <div className="flex-1 flex flex-col items-center p-4 rounded-2xl shadow-xl/20 inset-shadow-sm">
                    <h3 className="text-3xl font-bold">
                        {stats.thisWeek}
                    </h3>
                    <span className="text-sm font-medium">
                        This Week
                    </span>
                </div>
                <div className="flex-1 flex flex-col items-center p-4 rounded-2xl shadow-xl/20 inset-shadow-sm">
                    <h3 className="text-3xl font-bold">
                        {stats.interviews}
                    </h3>
                    <span className="text-sm font-medium">
                        Interviews
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Stats