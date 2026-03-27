'use client'

import * as React from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'

export default function ThemeRegistry({ children }) {
    const [cache] = React.useState(() => {
        const cache = createCache({ key: 'mui', prepend: true })
        cache.compat = true
        return cache
    })

    const { extractCriticalToChunks } = require('@emotion/server')

    useServerInsertedHTML(() => {
        const chunks = extractCriticalToChunks('')
        return (
            <>
                {chunks.styles.map((style) => (
                    <style
                        key={style.key}
                        data-emotion={`${style.key} ${style.ids.join(' ')}`}
                        dangerouslySetInnerHTML={{ __html: style.css }}
                    />
                ))}
            </>
        )
    })

    return <CacheProvider value={cache}>{children}</CacheProvider>
}