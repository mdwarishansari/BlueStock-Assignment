import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testUtils';
import ImageUploader from '../ImageUploader';

describe('ImageUploader', () => {
  const mockOnImageSelect = vi.fn();
  const mockOnImageRemove = vi.fn();

  it('renders uploader with label', () => {
    renderWithProviders(
      <ImageUploader
        label="Company Logo"
        type="logo"
        onImageSelect={mockOnImageSelect}
        onImageRemove={mockOnImageRemove}
      />
    );
    
    expect(screen.getAllByText('Company Logo').length).toBeGreaterThan(0);

    expect(screen.getByText(/click to upload logo/i)).toBeInTheDocument();
  });

  it('displays current image when provided', () => {
    const currentImage = 'https://example.com/logo.jpg';
    
    renderWithProviders(
      <ImageUploader
        label="Company Logo"
        type="logo"
        currentImage={currentImage}
        onImageSelect={mockOnImageSelect}
        onImageRemove={mockOnImageRemove}
      />
    );
    
    const image = screen.getByAltText('Company Logo');
    expect(image).toHaveAttribute('src', currentImage);
  });

  it('accepts valid image file', async () => {
    const user = userEvent.setup();
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });
    
    renderWithProviders(
      <ImageUploader
        label="Company Logo"
        type="logo"
        onImageSelect={mockOnImageSelect}
        onImageRemove={mockOnImageRemove}
      />
    );
    
    const input = screen.getByLabelText(/company logo file input/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalledWith(file);
    });
  });

  it('shows remove button when image is present', () => {
    const currentImage = 'https://example.com/logo.jpg';
    
    renderWithProviders(
      <ImageUploader
        label="Company Logo"
        type="logo"
        currentImage={currentImage}
        onImageSelect={mockOnImageSelect}
        onImageRemove={mockOnImageRemove}
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onImageRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const currentImage = 'https://example.com/logo.jpg';
    
    renderWithProviders(
      <ImageUploader
        label="Company Logo"
        type="logo"
        currentImage={currentImage}
        onImageSelect={mockOnImageSelect}
        onImageRemove={mockOnImageRemove}
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(mockOnImageRemove).toHaveBeenCalled();
  });
});
