import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Basic Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should render a div', () => {
    render(<div>Test</div>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
}) 