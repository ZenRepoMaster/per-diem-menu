/**
 * Unit tests for SearchBar component
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar, filterMenuItems } from '../search-bar'

describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Search menu items')).toBeInTheDocument()
  })

  it('should display placeholder text', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('should call onChange when user types', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<SearchBar value="" onChange={handleChange} />)
    const input = screen.getByLabelText('Search menu items')
    
    await user.type(input, 'burger')
    expect(handleChange).toHaveBeenCalledTimes(6) // Called for each character
  })

  it('should show clear button when value is not empty', () => {
    render(<SearchBar value="test" onChange={() => {}} />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('should hide clear button when value is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<SearchBar value="test" onChange={handleChange} />)
    const clearButton = screen.getByLabelText('Clear search')
    
    await user.click(clearButton)
    expect(handleChange).toHaveBeenCalledWith('')
  })
})

describe('filterMenuItems', () => {
  const mockItems = [
    { name: 'Burger', description: 'Delicious beef burger' },
    { name: 'Pizza', description: 'Cheese pizza' },
    { name: 'Salad', description: 'Fresh garden salad' },
  ]

  it('should return all items when query is empty', () => {
    const result = filterMenuItems(mockItems, '')
    expect(result).toHaveLength(3)
  })

  it('should filter by name', () => {
    const result = filterMenuItems(mockItems, 'burger')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Burger')
  })

  it('should filter by description', () => {
    const result = filterMenuItems(mockItems, 'cheese')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Pizza')
  })

  it('should be case-insensitive', () => {
    const result = filterMenuItems(mockItems, 'BURGER')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Burger')
  })

  it('should return empty array when no matches', () => {
    const result = filterMenuItems(mockItems, 'xyz123')
    expect(result).toHaveLength(0)
  })

  it('should match partial strings', () => {
    const result = filterMenuItems(mockItems, 'piz')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Pizza')
  })
})

