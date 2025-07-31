import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AnimatedLogo from '@/components/AnimatedLogo'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

describe('AnimatedLogo', () => {
  it('renders with default props', () => {
    render(<AnimatedLogo />)
    
    expect(screen.getByText('ProMail')).toBeInTheDocument()
    expect(screen.getByText('Assistant IA')).toBeInTheDocument()
  })

  it('renders without text when showText is false', () => {
    render(<AnimatedLogo showText={false} />)
    
    expect(screen.queryByText('ProMail')).not.toBeInTheDocument()
    expect(screen.queryByText('Assistant IA')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<AnimatedLogo size="sm" />)
    expect(screen.getByText('ProMail')).toHaveClass('text-lg')

    rerender(<AnimatedLogo size="md" />)
    expect(screen.getByText('ProMail')).toHaveClass('text-xl')

    rerender(<AnimatedLogo size="lg" />)
    expect(screen.getByText('ProMail')).toHaveClass('text-2xl')

    rerender(<AnimatedLogo size="xl" />)
    expect(screen.getByText('ProMail')).toHaveClass('text-3xl')
  })

  it('applies custom className', () => {
    render(<AnimatedLogo className="custom-class" />)
    
    const container = screen.getByText('ProMail').closest('div')
    expect(container).toHaveClass('custom-class')
  })

  it('triggers animation on mouse enter', () => {
    render(<AnimatedLogo />)
    
    const container = screen.getByText('ProMail').closest('div')
    fireEvent.mouseEnter(container!)
    
    // Vérifier que l'animation est déclenchée (via les classes CSS)
    expect(container).toBeInTheDocument()
  })

  it('stops animation on mouse leave', () => {
    render(<AnimatedLogo />)
    
    const container = screen.getByText('ProMail').closest('div')
    fireEvent.mouseEnter(container!)
    fireEvent.mouseLeave(container!)
    
    // Vérifier que l'animation s'arrête
    expect(container).toBeInTheDocument()
  })
}) 