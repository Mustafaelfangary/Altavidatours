import type { Meta, StoryObj } from '@storybook/react';
import { ContentForm } from '@/components/forms/ContentForm';

const meta = {
  title: 'Forms/ContentForm',
  component: ContentForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockModel = {
  id: 'test-model',
  name: 'Test Model',
  description: 'A test content model',
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

export const Default: Story = {
  args: {
    model: mockModel,
    initialData: {},
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

export const WithInitialData: Story = {
  args: {
    model: mockModel,
    initialData: {
      title: 'Initial Title',
      description: 'Initial description',
      isFeatured: true,
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};
