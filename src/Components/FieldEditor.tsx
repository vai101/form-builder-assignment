import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormField } from '../Types/form';
import { updateField, removeField } from '../Features/formBuilderSlice';
import {
    Accordion, AccordionSummary, AccordionDetails, Typography, TextField,
    FormControlLabel, Switch, IconButton, Box, Divider, FormGroup, Checkbox,
    Button, Chip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface FieldEditorProps {
    field: FormField;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field }) => {
    const dispatch = useDispatch();
    const [newOption, setNewOption] = useState('');

    const handleFieldChange = (changes: Partial<FormField>) => {
        dispatch(updateField({ id: field.id, changes }));
    };

    const handleAddOption = () => {
        if (newOption.trim() !== '') {
            const updatedOptions = [...(field.options || []), newOption.trim()];
            handleFieldChange({ options: updatedOptions });
            setNewOption(''); 
        }
    };

    const handleDeleteOption = (optionIndex: number) => {
        const updatedOptions = field.options?.filter((_, index) => index !== optionIndex);
        handleFieldChange({ options: updatedOptions });
    };

    const handleValidationChange = (rule: string, value: any) => {
        handleFieldChange({
            validations: { ...field.validations, [rule]: value },
        });
    };

    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ flexGrow: 1 }}>{field.label || 'New Field'}</Typography>
                <IconButton onClick={() => dispatch(removeField(field.id))} size="small">
                    <DeleteIcon />
                </IconButton>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Label"
                        value={field.label}
                        onChange={(e) => handleFieldChange({ label: e.target.value })}
                        fullWidth
                    />

                    {(field.type === 'Select' || field.type === 'Radio') && (
                        <>
                            <Divider />
                            <Typography variant="h6">Options</Typography>
                            <Box>
                                {field.options?.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option}
                                        onDelete={() => handleDeleteOption(index)}
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                ))}
                            </Box>
                            <Box display="flex" gap={1} alignItems="center">
                                <TextField
                                    label="Add New Option"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                                    size="small"
                                    fullWidth
                                />
                                <Button onClick={handleAddOption} variant="contained" endIcon={<AddCircleIcon />}>
                                    Add
                                </Button>
                            </Box>
                        </>
                    )}

                    <Divider />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.isDerived || false}
                                onChange={(e) => handleFieldChange({ isDerived: e.target.checked })}
                            />
                        }
                        label="Derived Field"
                    />
                    {field.isDerived && (
                        <Box sx={{ pl: 2, mt: 1, borderLeft: '2px solid #eee' }}>
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <InputLabel>Calculation Type</InputLabel>
                                <Select
                                    value={field.calculationType || ''}
                                    label="Calculation Type"
                                    onChange={(e) => handleFieldChange({ calculationType: e.target.value as any })}
                                >
                                    <MenuItem value="Age">Age from Date of Birth</MenuItem>
                                    <MenuItem value="FullName">Full Name</MenuItem>
                                    <MenuItem value="TotalCost">Total Cost</MenuItem>
                                    <MenuItem value="BMI">BMI</MenuItem>
                                    <MenuItem value="DaysUntilEvent">Days Until Event</MenuItem>
                                    <MenuItem value="EligibilityStatus">Eligibility Status (from Age)</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                Note: Parent fields are found by their labels (e.g., 'First Name', 'Weight (kg)', etc.).
                            </Typography>
                        </Box>
                    )}

                    <Divider />
                    <Typography variant="h6">Validation Rules</Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.validations.required || false}
                                    onChange={(e) => handleValidationChange('required', e.target.checked)}
                                />
                            }
                            label="Required (Not Empty)"
                        />
                        <TextField
                            label="Minimum Length"
                            type="number"
                            value={field.validations.minLength || ''}
                            onChange={(e) => handleValidationChange('minLength', Number(e.target.value))}
                            margin="normal"
                            size="small"
                        />
                         <TextField
                            label="Maximum Length"
                            type="number"
                            value={field.validations.maxLength || ''}
                            onChange={(e) => handleValidationChange('maxLength', Number(e.target.value))}
                            margin="normal"
                            size="small"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={field.validations.isEmail || false}
                                    onChange={(e) => handleValidationChange('isEmail', e.target.checked)}
                                />
                            }
                            label="Email Format"
                        />
                         <FormControlLabel
                            control={
                                <Checkbox
                                    checked={field.validations.customPassword || false}
                                    onChange={(e) => handleValidationChange('customPassword', e.target.checked)}
                                />
                            }
                            label="Password format (min 8 chars, 1 number)"
                        />
                    </FormGroup>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default FieldEditor;