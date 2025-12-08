import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ContentForm } from '../ContentForm';

const mockModel = {
  id: 'test-model',
  name: 'Test Model',
  description: 'Test model description',
  icon: 'FileText',
  searchFields: ['title'],
  fields: [
    {
      id: 'title',
      type: 'string' as const,
      label: 'Title',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
      },
    },
    {
      id: 'description',
      type: 'textarea' as const,
      label: 'Description',
      required: false,
    },
    {
      id: 'isFeatured',
      type: 'boolean' as const,
      label: 'Featured',
      required: false,
    },
  ],
};

describe('ContentForm', () => {
  it('renders form fields based on model', () => {
    render(
      <ContentForm
        model={mockModel}
        initialData={{}}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Featured/)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const handleSubmit = jest.fn();
    render(
      <ContentForm
        model={mockModel}
        initialData={{}}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <ContentForm
        model={mockModel}
        initialData={{}}
        onSubmit={handleSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    
    fireEvent.change(titleInput, {
      target: { value: 'Test Title' },
    });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });
    
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Title',
          description: 'Test Description',
        })
      );
    });
  });

  it('displays validation errors for invalid input', async () => {
    const handleSubmit = jest.fn();
    render(
      <ContentForm
        model={mockModel}
        initialData={{}}
        onSubmit={handleSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/Title/);
    
    // Enter a title that's too short
    fireEvent.change(titleInput, {
      target: { value: 'ab' },
    });
    
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText(/Must be at least 3 characters/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
