export interface IFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'password' | 'file';
    required?: boolean;
    options?: { value: string; label: string }[] | string[];
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    colSpan?: number; // 1 o 2, por ejemplo
    widthClass?: string; // Ejemplo: 'col-span-2' o 'w-full md:w-1/2'
    // Propiedades específicas para campos de tipo 'file'
    accept?: string; // Ejemplo: 'image/*', '.pdf,.doc', etc.
    multiple?: boolean; // Si permite múltiples archivos
    fileType?: string; // Tipo MIME del archivo
}