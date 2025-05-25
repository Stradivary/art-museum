'use client'

import DOMPurify from 'dompurify'

interface SafeHtmlRendererProps {
  html: string
  className?: string
}

/**
 * Component for safely rendering HTML content with sanitization
 */
export function SafeHtmlRenderer({ html, className }: Readonly<SafeHtmlRendererProps>) {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(html)

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
