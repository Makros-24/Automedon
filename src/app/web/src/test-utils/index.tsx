import React from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'motion/react'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: string
  reduceMotion?: boolean
}

function CustomProviders({ 
  children, 
  theme = 'light',
  reduceMotion = true 
}: { 
  children: React.ReactNode
  theme?: string
  reduceMotion?: boolean
}) {
  return (
    <ThemeProvider 
      defaultTheme={theme}
      enableSystem={false}
      forcedTheme={theme}
    >
      <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </ThemeProvider>
  )
}

export function render(
  ui: React.ReactElement,
  { theme, reduceMotion, ...options }: CustomRenderOptions = {}
) {
  return rtlRender(ui, {
    wrapper: (props) => (
      <CustomProviders 
        theme={theme}
        reduceMotion={reduceMotion}
        {...props}
      />
    ),
    ...options,
  })
}

export * from '@testing-library/react'
export { render as rtlRender }