# Teaching Tip System

A comprehensive teaching tip system for guiding users through your application features. The system highlights specific elements while dimming the rest of the interface and provides contextual guidance.

## Features

- 🎯 **Element Highlighting**: Automatically highlights target elements with a glowing border
- 🌫️ **Background Dimming**: Dims the entire interface except for the highlighted element
- 📱 **Responsive Positioning**: Automatically adjusts tooltip position based on viewport constraints
- ⌨️ **Keyboard Navigation**: Navigate tips with arrow keys, Enter, and Escape
- 🎨 **Smooth Animations**: Beautiful transitions using Framer Motion
- 📦 **Easy Registration**: Simple hook-based API for registering tips
- 🔗 **Flexible Triggers**: Multiple ways to trigger tips (buttons, links, programmatically)

## Basic Usage

### 1. Register Teaching Tips

Use the `useRegisterTeachingTip` hook to register elements for teaching tips:

```tsx
import { useRegisterTeachingTip } from '@/presentation/hooks/useRegisterTeachingTip'

function MyComponent() {
  const searchTip = useRegisterTeachingTip({
    id: 'search-feature',
    title: 'Search Functionality',
    description: 'Use this search bar to find specific content quickly.',
    position: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
  })

  return (
    <div>
      <input 
        ref={searchTip.ref} // Attach the ref to your target element
        placeholder="Search..."
      />
    </div>
  )
}
```

### 2. Add Triggers

Use the `TeachingTipTrigger` component to create buttons that show tips:

```tsx
import { TeachingTipTrigger } from '@/presentation/components/shared/TeachingTipTrigger'

function MyComponent() {
  return (
    <div>
      {/* Show all registered tips in sequence */}
      <TeachingTipTrigger showAll variant="button">
        Start Tutorial
      </TeachingTipTrigger>

      {/* Show a specific tip */}
      <TeachingTipTrigger tipId="search-feature" variant="icon" />

      {/* Link style trigger */}
      <TeachingTipTrigger tipId="save-feature" variant="link">
        Learn about saving
      </TeachingTipTrigger>
    </div>
  )
}
```

### 3. Programmatic Control

Access the teaching tip context directly for more control:

```tsx
import { useTeachingTip } from '@/presentation/components/shared/TeachingTipProvider'

function MyComponent() {
  const { showTip, showAllTips, closeTips } = useTeachingTip()

  return (
    <div>
      <button onClick={() => showTip('specific-tip-id')}>
        Show Specific Tip
      </button>
      
      <button onClick={showAllTips}>
        Show All Tips
      </button>
      
      <button onClick={closeTips}>
        Close Tips
      </button>
    </div>
  )
}
```

## API Reference

### `useRegisterTeachingTip` Hook

```tsx
interface UseTeachingTipOptions {
  id: string                    // Unique identifier for the tip
  title: string                 // Tip title
  description: string           // Tip description
  position?: 'top' | 'bottom' | 'left' | 'right' // Preferred position
  allowBackdropClick?: boolean  // Allow closing by clicking backdrop (default: true)
  showSkipAll?: boolean        // Show "Skip All" button (default: true)
  nextButtonText?: string      // Custom text for next button
  skipButtonText?: string      // Custom text for skip button
  finishButtonText?: string    // Custom text for finish button
  enabled?: boolean            // Whether to register the tip (default: true)
}

const tipControl = useRegisterTeachingTip(options)
// Returns: { ref, show, isRegistered }
```

### `TeachingTipTrigger` Component

```tsx
interface TeachingTipTriggerProps {
  variant?: 'button' | 'icon' | 'link'  // Visual style
  size?: 'sm' | 'md' | 'lg'             // Size (for button variant)
  className?: string                     // Additional CSS classes
  children?: React.ReactNode             // Custom content
  tipId?: string                         // Show specific tip
  showAll?: boolean                      // Show all registered tips
}
```

### Teaching Tip Context

```tsx
interface TeachingTipContextType {
  // State
  isActive: boolean
  currentTip: TeachingTip | null
  currentIndex: number
  totalTips: number
  
  // Actions
  registerTip: (tip: TeachingTip) => void
  unregisterTip: (id: string) => void
  showTip: (id: string) => void
  showAllTips: () => void
  nextTip: () => void
  skipTip: () => void
  skipAllTips: () => void
  closeTips: () => void
  
  // Utilities
  isTipRegistered: (id: string) => boolean
  getTipById: (id: string) => TeachingTip | undefined
}
```

## Advanced Usage

### Conditional Tips

```tsx
const myTip = useRegisterTeachingTip({
  id: 'advanced-feature',
  title: 'Advanced Feature',
  description: 'This feature is only available to premium users.',
  enabled: user.isPremium, // Only register if user is premium
})
```

### Custom Styling

The teaching tip system uses CSS classes that can be customized:

```css
/* Highlight border color */
.border-primary {
  border-color: your-primary-color;
}

/* Tooltip background */
.bg-background {
  background-color: your-background-color;
}

/* Progress indicators */
.bg-primary {
  background-color: your-primary-color;
}
```

### Keyboard Shortcuts

- **Escape**: Close all tips
- **Enter** or **Right Arrow**: Next tip
- **Left Arrow**: Previous tip (when available)

## Best Practices

1. **Logical Flow**: Register tips in the order users should learn about features
2. **Clear Descriptions**: Keep descriptions concise but informative
3. **Appropriate Positioning**: Choose positions that don't obscure important content
4. **Responsive Design**: Test tips on different screen sizes
5. **Conditional Display**: Only show relevant tips based on user context
6. **Accessibility**: Ensure tips are keyboard navigable and screen reader friendly

## Integration

The teaching tip system is already integrated into the MainLayout, so it's available throughout your application. The system includes:

- `TeachingTipProvider`: Context provider for state management
- `TeachingTipOverlay`: The visual overlay and tooltip rendering
- Keyboard event handling for navigation
- Automatic cleanup when components unmount

## Example Implementation

See `src/presentation/components/examples/TeachingTipExample.tsx` for a complete working example that demonstrates all features of the teaching tip system.
