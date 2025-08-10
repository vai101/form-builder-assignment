// src/types/form.ts
export interface ValidationRules {
  required?: boolean; 
  minLength?: number; 
  maxLength?: number; 
  isEmail?: boolean; 
  customPassword?: boolean; 
}


export interface FormField {
  id: string;
  type: 'Text' | 'Number' | 'Textarea' | 'Select' | 'Radio' | 'Checkbox' | 'Date';
  label: string;
  defaultValue?: any;
  options?: string[];
  validations: ValidationRules;
  isDerived: boolean;
  calculationType?: 'FullName' | 'TotalCost' | 'BMI' | 'DaysUntilEvent' | 'EligibilityStatus' | 'Age';
  derivation?: {
    parentFieldIds: string[];
    formula: string;
  };
}


export interface FormSchema {
  id: string;
  name: string; 
  createdAt: string; 
  fields: FormField[];
}