import type { SettingsProps } from "../../../types";

// Appearance.tsx
const Appearance = ({ theme, changeTheme }: SettingsProps) => {
    const containerColor = theme === "darkmode"
        ? "bg-slate-800 border-slate-700"
        : "bg-white border-gray-200 shadow-sm";

    return (
        <div className={`p-3 rounded-xl border ${containerColor}`}>
            <h2 className="text-xl font-semibold mb-3">Appearance</h2>
            <div className="flex flex-col gap-3">
                <label className="hover:opacity-70 flex items-center gap-3 cursor-pointer">
                    <input
                        onChange={changeTheme}
                        type="radio"
                        value="lightmode"
                        name="appearance"
                        checked={theme === "lightmode"}
                        className="w-4 h-4"
                    />
                    <span>
                        ☀️ Light Mode
                    </span>
                </label>
                <label className="hover:opacity-70 flex items-center gap-3 cursor-pointer">
                    <input
                        onChange={changeTheme}
                        type="radio"
                        value="darkmode"
                        name="appearance"
                        checked={theme === "darkmode"}
                        className="w-4 h-4"
                    />
                    <span>
                        🌑 Dark Mode
                    </span>
                </label>
            </div>
        </div>
    );
}

export default Appearance