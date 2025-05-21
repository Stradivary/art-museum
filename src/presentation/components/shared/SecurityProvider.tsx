import React, { useEffect } from 'react'
import { usePreventScreenshot } from '../../hooks/usePreventScreenshot'

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {

    usePreventScreenshot()

    // CSS to prevent user-select and drag
    useEffect(() => {
        const style = document.createElement('style')
        style.innerHTML = `
      body, #root, .security-protected {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
      }
    `
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [])
 
    return (
        <div
            className="security-protected"
            style={{ minHeight: '100vh', position: 'relative' }}
        >
            {children}
            
        </div>
    )
}
