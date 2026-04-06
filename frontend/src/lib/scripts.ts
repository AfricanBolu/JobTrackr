function toMatchPattern(site: string): string {
    // Strip protocol, trailing slashes, paths — keep only hostname
    const cleaned = site
        .replace(/^https?:\/\//, '') // remove protocol
        .replace(/^www\./, '') // remove www
        .split('/')[0] // remove any path
        .split(':')[0] // remove port

    return `*://*.${cleaned}/*`
}

export async function syncContentScripts(sites: string[]) {
    const existing = await chrome.scripting.getRegisteredContentScripts()
    const existingIds = new Set(existing.map((s) => s.id))

    if (existingIds.size > 0) {
        await chrome.scripting.unregisterContentScripts({
            ids: [...existingIds],
        })
    }

    const matches = sites.map(toMatchPattern)
    console.log('Registering content scripts for:', matches) // helpful for debugging

    await chrome.scripting.registerContentScripts([
        {
            id: 'jobtrackr-content',
            matches,
            js: ['content.js'],
            runAt: 'document_idle',
            world: 'ISOLATED',
        },
        {
            id: 'jobtrackr-inject',
            matches,
            js: ['inject.js'],
            runAt: 'document_start',
            world: 'MAIN',
        },
    ])
}
