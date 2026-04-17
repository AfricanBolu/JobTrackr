import "../../index.css"
import logo1 from '../../assets/logo1.png';
import type { NavProps } from "../../types";

const Nav = ({ settingsClick, showSettings, theme }: NavProps) => {
    const navTheme = theme === "darkmode"
        ? "bg-slate-800 border-slate-700 text-slate-100"
        : "bg-white border-gray-200 text-slate-800";

    const buttonTheme = theme === "darkmode"
        ? "hover:text-blue-400"
        : "hover:text-blue-600";


    return (
        <header
            className={`shrink-0 border-b ${navTheme}`}
        >
            <nav
                className='flex items-center justify-between px-4 py-3'
            >
                {/*left side: logo and title */}
                <div className='flex items-center gap-2'>
                    <img
                        src={logo1}
                        alt='JobTracker Logo'
                        className='w-6 h-6 rounded-full'
                    />
                    <span
                        className='text-lg font-semibold'
                    >
                        JobTracker
                    </span>
                </div>
                {/*right side: settings button */}
                <button
                    onClick={settingsClick}
                    className={`text-sm font-medium transition-colors ${buttonTheme}`}
                >
                    {showSettings ? 'Close' : 'Settings'}
                </button>
            </nav>
        </header>
    )
}

export default Nav