import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { RootState } from '../App/store';
import { loadForms } from '../Features/formsSlice';
import { FormField } from '../Types/form';
import {
    Box, Button, Container, TextField, Typography, AppBar, Toolbar, Checkbox,
    RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, FormHelperText,
    Radio
} from '@mui/material';


const findFieldByLabel = (fields: FormField[], label: string) =>
    fields.find(f => f.label.toLowerCase().includes(label.toLowerCase()));


const PreviewPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const form = useSelector((state: RootState) => state.forms.forms.find((f) => f.id === formId));

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    const formValues = watch(); 

    useEffect(() => {
        if (!form) {
            dispatch(loadForms());
        }
    }, [dispatch, form]);

  
    useEffect(() => {
        if (!form) return;

        const derivedFields = form.fields.filter(f => f.isDerived);

        derivedFields.forEach(field => {
            let calculatedValue: any = '';

        
            switch (field.calculationType) {
                case 'Age': {
                    const dobField = findFieldByLabel(form.fields, 'date of birth');
                    const dobValue = dobField ? formValues[dobField.id] : null;
                    if (dobValue) {
                        const birthDate = new Date(dobValue);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                        calculatedValue = age >= 0 ? age : 0;
                    }
                    break;
                }
                case 'FullName': {
                    const firstNameField = findFieldByLabel(form.fields, 'first name');
                    const lastNameField = findFieldByLabel(form.fields, 'last name');
                    const firstName = firstNameField ? formValues[firstNameField.id] : '';
                    const lastName = lastNameField ? formValues[lastNameField.id] : '';
                    if (firstName || lastName) {
                        calculatedValue = `${firstName} ${lastName}`.trim();
                    }
                    break;
                }
                case 'TotalCost': {
                    const quantityField = findFieldByLabel(form.fields, 'quantity');
                    const priceField = findFieldByLabel(form.fields, 'unit price');
                    const quantity = quantityField ? Number(formValues[quantityField.id]) : 0;
                    const price = priceField ? Number(formValues[priceField.id]) : 0;
                    calculatedValue = (quantity * price).toFixed(2); 
                    break;
                }
                case 'BMI': {
                    const weightField = findFieldByLabel(form.fields, 'weight (kg)');
                    const heightField = findFieldByLabel(form.fields, 'height (m)');
                    const weight = weightField ? Number(formValues[weightField.id]) : 0;
                    const height = heightField ? Number(formValues[heightField.id]) : 0;
                    if (weight > 0 && height > 0) {
                        calculatedValue = (weight / (height * height)).toFixed(2);
                    }
                    break;
                }
                case 'DaysUntilEvent': {
                    const eventDateField = findFieldByLabel(form.fields, 'event date');
                    const eventDateValue = eventDateField ? formValues[eventDateField.id] : null;
                    if (eventDateValue) {
                        const eventDate = new Date(eventDateValue);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const diffTime = eventDate.getTime() - today.getTime();
                        calculatedValue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                    break;
                }
                case 'EligibilityStatus': {
                    const ageField = findFieldByLabel(form.fields, 'age');
                    const age = ageField ? Number(formValues[ageField.id]) : 0;
                    if (age || age === 0) { 
                        calculatedValue = age >= 18 ? 'Eligible' : 'Not Eligible';
                    }
                    break;
                }
                default:
                    break;
            }

            
            if (formValues[field.id] !== calculatedValue) {
                setValue(field.id, calculatedValue, { shouldValidate: true });
            }
        });

    }, [form, formValues, setValue]);


    if (!form) {
        return <Typography>Loading form...</Typography>;
    }

    const onSubmit = (data: any) => {
        alert('Form Submitted!\n' + JSON.stringify(data, null, 2));
    };

    const renderField = (field: FormField) => {
        const rules = {
            required: field.validations.required ? 'This field is required' : false,
            minLength: field.validations.minLength ? { value: field.validations.minLength, message: `Minimum length is ${field.validations.minLength}` } : undefined,
            maxLength: field.validations.maxLength ? { value: field.validations.maxLength, message: `Maximum length is ${field.validations.maxLength}` } : undefined,
            pattern: field.validations.isEmail ? { value: /^\S+@\S+$/i, message: 'Invalid email address' } : undefined,
            validate: {
                customPassword: (value: string) => {
                    if (!field.validations.customPassword) return true;
                    return (value.length >= 8 && /\d/.test(value)) || 'Password must be at least 8 characters and contain a number';
                }
            }
        };

        switch (field.type) {
            case 'Checkbox':
                return (
                    <FormControl sx={{ my: 1 }} required={field.validations.required} error={!!errors[field.id]}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name={field.id}
                                    control={control}
                                    defaultValue={field.defaultValue || false}
                                    render={({ field: controllerField }) => <Checkbox {...controllerField} checked={!!controllerField.value} />}
                                />
                            }
                            label={field.label}
                        />
                        {errors[field.id] && <FormHelperText>{errors[field.id]?.message as string}</FormHelperText>}
                    </FormControl>
                );

            case 'Radio':
                return (
                    <FormControl sx={{ my: 1 }} required={field.validations.required} error={!!errors[field.id]}>
                        <FormLabel>{field.label}</FormLabel>
                        <Controller
                            name={field.id}
                            control={control}
                            rules={rules}
                            defaultValue={field.defaultValue || ''}
                            render={({ field: controllerField }) => (
                                <RadioGroup {...controllerField}>
                                    {field.options?.map((option) => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio />}
                                            label={option}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                        />
                        {errors[field.id] && <FormHelperText>{errors[field.id]?.message as string}</FormHelperText>}
                    </FormControl>
                );

            case 'Select':
                return (
                    <FormControl sx={{ my: 1 }} fullWidth required={field.validations.required} error={!!errors[field.id]}>
                        <InputLabel>{field.label}</InputLabel>
                        <Controller
                            name={field.id}
                            control={control}
                            rules={rules}
                            defaultValue={field.defaultValue || ''}
                            render={({ field: controllerField }) => (
                                <Select {...controllerField} label={field.label}>
                                    {field.options?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors[field.id] && <FormHelperText>{errors[field.id]?.message as string}</FormHelperText>}
                    </FormControl>
                );

            default:
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        defaultValue={field.defaultValue || ''}
                        rules={rules}
                        render={({ field: controllerField }) => (
                            <TextField
                                {...controllerField}
                                label={field.label}
                                type={field.type === 'Date' ? 'date' : field.type.toLowerCase()}
                                fullWidth
                                margin="normal"
                                multiline={field.type === 'Textarea'}
                                rows={field.type === 'Textarea' ? 4 : 1}
                                InputLabelProps={{ shrink: field.type === 'Date' || undefined }}
                                InputProps={{ readOnly: field.isDerived }}
                                error={!!errors[field.id]}
                                helperText={errors[field.id]?.message as string}
                            />
                        )}
                    />
                );
        }
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {form.name}
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/myforms')}>Back to My Forms</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4, mb: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {form.fields.map((field) => (
                        <Box key={field.id} sx={{mt: 2}}>{renderField(field)}</Box>
                    ))}
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                        Submit
                    </Button>
                </form>
            </Container>
        </Box>
    );
};

export default PreviewPage;