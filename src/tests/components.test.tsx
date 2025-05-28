import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../components/navbar'
import Dashboard from '../app/dashboard/page'
import FoodAnalyzer from '../components/food-analyzer'

describe('Component Tests', () => {
  it('renders Navbar component', () => {
    render(<Navbar />)
    expect(screen.getByText('NutriAI')).toBeInTheDocument()
  })

  it('renders Dashboard component', () => {
    render(<Dashboard />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('renders FoodAnalyzer component', () => {
    render(<FoodAnalyzer />)
    expect(screen.getByText('Analyze Food')).toBeInTheDocument()
  })
}) 