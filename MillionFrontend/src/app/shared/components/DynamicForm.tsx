import React, { useState } from 'react';
import { IFieldConfig } from '../interface/IFieldConfig'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface DynamicFormProps {
  fields: IFieldConfig[];
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  submitText?: string;
  className?: string;
  renderSubmitButton?: (props: { submitText: string }) => React.ReactNode;
  submitButtonClassName?: string;
}

const validate = (fields: IFieldConfig[], values: Record<string, any>) => {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.required && (!value || value === '')) {
      errors[field.name] = 'Este campo es obligatorio';
    }
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field.name] = 'Correo inválido';
      }
    }
    if (field.maxLength && value && value.length > field.maxLength) {
      errors[field.name] = `Máximo ${field.maxLength} caracteres`;
    }
    if (field.minLength && value && value.length < field.minLength) {
      errors[field.name] = `Mínimo ${field.minLength} caracteres`;
    }
  }
  return errors;
};

const renderField = (
  field: IFieldConfig,
  value: any,
  error: string | undefined,
  touched: boolean | undefined,
  handleChange: React.ChangeEventHandler<any>,
  handleBlur: React.FocusEventHandler<any>,
  passwordVisibility: Record<string, boolean>,
  togglePasswordVisibility: (name: string) => void
) => {
  const baseClass = `w-full px-6 py-3 rounded-xl border bg-[#1f2937]/80 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#34615a]/50 transition-all duration-200 ${error && touched ? 'border-red-500' : 'border-[#34615a]/30'}`;
  
  switch (field.type) {
    case 'select':
      return (
        <select
          id={field.name}
          name={field.name}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={baseClass}
        >
          <option value="">Selecciona...</option>
          {(Array.isArray(field.options) ? field.options : []).map(opt =>
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
      );
    case 'password':
      return (
        <div className="relative">
          <input
            id={field.name}
            name={field.name}
            type={passwordVisibility[field.name] ? 'text' : 'password'}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            minLength={field.minLength}
            className={`${baseClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(field.name)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-black hover:text-black/80 hover:bg-white/20 transition-all duration-200 rounded-r-xl"
          >
            {passwordVisibility[field.name] ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      );
    default:
      return (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          minLength={field.minLength}
          className={baseClass}
        />
      );
  }
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields, initialValues, onSubmit, submitText = 'Guardar', className = '', renderSubmitButton
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(fields, { ...values, [name]: values[name] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(fields, values);
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])));
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-6 p-6 ${className}`} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <div
              key={field.name}
              className={`${field.colSpan === 2 ? 'md:col-span-2' : ''}`}
            >
              <label htmlFor={field.name} className="block text-sm font-medium text-[#34615a] mb-2">
                {field.label}{field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(
                field,
                values[field.name],
                errors[field.name],
                touched[field.name],
                handleChange,
                handleBlur,
                passwordVisibility,
                togglePasswordVisibility
              )}
              {errors[field.name] && touched[field.name] && (
                <span className="text-xs text-red-500 mt-1">{errors[field.name]}</span>
              )}
            </div>
          ))}
        </div>
        {renderSubmitButton ? (
          renderSubmitButton({ submitText })
        ) : (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#1a2e29] to-[#34615a] hover:from-[#34615a] hover:to-[#1a2e29] text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              {submitText}
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default DynamicForm; 