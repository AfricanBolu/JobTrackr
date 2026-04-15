import { loadSupportedSites, saveSupportedSites } from '../../../lib/storage'
import { syncContentScripts } from '../../../lib/scripts'
// import type { ThemeProps } from '../../../types'
import { useEffect, useState } from 'react'

const DefaultSites = [
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'handshake.com',
]

const SiteSettings = () => {
    const [site, setSite] = useState<string[]>(DefaultSites)
    const [newSite, setNewSite] = useState('')
    const [isInitiated, setIsInitiated] = useState(false)

    //load sites from chrome storage
    useEffect(() => {
        let unmounted = false
        const load = async () => {
            const sites = await loadSupportedSites()
            if (!unmounted) {
                setSite(sites)
                setIsInitiated(true)
            }
        }

        load()

        return () => {
            unmounted = true
        }
    }, [])

    //save links to local storage
    useEffect(() => {
        if (!isInitiated) return

        saveSupportedSites(site)
        syncContentScripts(site)
    }, [site, isInitiated])

    // In addSite()
    const addSite = () => {
        if (!newSite) return
        const cleaned = newSite
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .split('/')[0]
            .split(':')[0]
            .toLowerCase()

        if (!cleaned || site.includes(cleaned)) return
        setSite([...site, cleaned])
        setNewSite('')
    }

    const removeSite = (siteToRemove: string) => {
        setSite(site.filter((site) => site !== siteToRemove))
    }

    const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addSite()
        }
    }

    // change container color based on theme
    const containerColor = 'bg-slate-800 border-slate-700'

    // change input color based on theme
    const inputColor = 'border-stone-600 bg-slate-800 text-stone-200'

    // change sites color based on theme
    const sitesColor = 'bg-slate-900 border-slate-700'

    // change button color based on theme
    const buttonTheme = 'bg-blue-600 hover:bg-blue-700 text-white'

    return (
        <div className={`p-3 rounded-xl border ${containerColor}`}>
            <h2 className="text-xl font-semibold mb-3">Supported Sites</h2>

            {/* Add a new site */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                    onKeyDown={keyHandler}
                    placeholder="example.com"
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm ${inputColor}`}
                />
                <button
                    onClick={addSite}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${buttonTheme}`}
                >
                    Add
                </button>
            </div>

            {/* List of sites */}
            <ul className="space-y-2">
                {site.map((site) => (
                    <li
                        key={site}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-sm ${sitesColor}`}
                    >
                        <span className="truncate">{site}</span>
                        <button
                            className="px-2 py-1 text-xs hover:text-red-500 transition-colors shrink-0"
                            onClick={() => removeSite(site)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SiteSettings
