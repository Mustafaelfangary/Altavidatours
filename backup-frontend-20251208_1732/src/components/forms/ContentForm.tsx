import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ContentModel } from '@/lib/content-models';

interface ContentFormProps {
  model: ContentModel;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
}

export function ContentForm({ model, initialData = {}, onSubmit, isSubmitting }: ContentFormProps) {
  // Generate Zod schema from model fields
  const schemaFields = model.fields.reduce((acc, field) => {
    let fieldSchema: any = z.any();
    
    // Add type-specific validations
    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Invalid email address');
        if (!field.required) {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;
      case 'number':
        fieldSchema = z.coerce.number();
        if (field.validation?.min !== undefined) {
          fieldSchema = fieldSchema.min(field.validation.min, {
            message: `Must be at least ${field.validation.min}`,
          });
        }
        if (field.validation?.max !== undefined) {
          fieldSchema = fieldSchema.max(field.validation.max, {
            message: `Must be at most ${field.validation.max}`,
          });
        }
        if (!field.required) {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'string':
      case 'textarea':
        fieldSchema = z.string();
        if (field.validation?.minLength) {
          fieldSchema = fieldSchema.min(field.validation.minLength, {
            message: `Must be at least ${field.validation.minLength} characters`,
          });
        }
        if (field.validation?.maxLength) {
          fieldSchema = fieldSchema.max(field.validation.maxLength, {
            message: `Must be at most ${field.validation.maxLength} characters`,
          });
        }
        if (!field.required) {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;
      case 'boolean':
        fieldSchema = z.boolean().default(false);
        break;
      case 'select':
        fieldSchema = z.string();
        if (!field.required) {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'file':
      case 'image':
        fieldSchema = z.any();
        if (!field.required) {
          fieldSchema = fieldSchema.optional();
        }
        break;
      default:
        if (!field.required) {
          fieldSchema = fieldSchema.optional();
        }
    }

    if (field.required && field.type !== 'boolean') {
      const currentSchema = fieldSchema;
      fieldSchema = currentSchema.refine((val: any) => {
        if (val === undefined || val === null || val === '') return false;
        return true;
      }, {
        message: `${field.label} is required`,
      });
    }

    return { ...acc, [field.id]: fieldSchema };
  }, {});

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object(schemaFields)),
    defaultValues: initialData,
  });

  const renderField = (field: any) => {
    const { id, type, label, description, options, placeholder } = field;
    
    return (
      <div key={id} className="space-y-2">
        <Label htmlFor={id} className={field.type === 'boolean' ? 'flex items-center gap-2' : ''}>
          {label}
          {field.required && <span className="text-destructive">*</span>}
          {field.type === 'boolean' && (
            <Controller
              name={id}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          )}
        </Label>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {field.type !== 'boolean' && (
          <Controller
            name={id}
            control={control}
            render={({ field: controllerField }) => {
              switch (type) {
                case 'textarea':
                  return (
                    <Textarea
                      {...controllerField}
                      placeholder={placeholder}
                      disabled={isSubmitting}
                      className={errors[id] ? 'border-destructive' : ''}
                    />
                  );
                case 'select':
                  return (
                    <Select
                      onValueChange={controllerField.onChange}
                      defaultValue={controllerField.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors[id] ? 'border-destructive' : ''}>
                        <SelectValue placeholder={placeholder || 'Select an option'} />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case 'file':
                case 'image':
                  return (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept={type === 'image' ? 'image/*' : '*/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            controllerField.onChange(file);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      {controllerField.value && typeof controllerField.value === 'string' && (
                        <div className="mt-2">
                          {type === 'image' ? (
                            <img 
                              src={controllerField.value} 
                              alt={label} 
                              className="h-32 w-auto rounded-md border"
                            />
                          ) : (
                            <a 
                              href={controllerField.value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View File
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                default:
                  return (
                    <Input
                      {...controllerField}
                      type={type}
                      placeholder={placeholder}
                      disabled={isSubmitting}
                      className={errors[id] ? 'border-destructive' : ''}
                    />
                  );
              }
            }}
          />
        )}

        {errors[id] && (
          <p className="text-sm text-destructive">
            {String(errors[id]?.message)}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {model.fields.map((field) => renderField(field))}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
