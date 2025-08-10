import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FormSchema } from '../Types/form';


const initialState: Omit<FormSchema, 'id' | 'createdAt'> = {
    name: 'Untitled Form',
    fields: [],
};

const formBuilderSlice = createSlice({
    name: 'formBuilder',
    initialState,
    reducers: {
        setFormName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'validations' | 'isDerived'>>) => {
            
            state.fields.push({
                ...action.payload,
                id: uuidv4(),
                validations: {},
                isDerived: false,
            });
        },
        updateField: (state, action: PayloadAction<{ id: string; changes: Partial<FormField> }>) => {
            
            const field = state.fields.find(f => f.id === action.payload.id);
            if (field) {
                Object.assign(field, action.payload.changes);
            }
        },
        removeField: (state, action: PayloadAction<string>) => {
            
            state.fields = state.fields.filter(f => f.id !== action.payload);
        },
        reorderFields: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
            
            const [removed] = state.fields.splice(action.payload.startIndex, 1);
            state.fields.splice(action.payload.endIndex, 0, removed);
        },
        resetBuilder: () => initialState,
    },
});

export const {
    setFormName,
    addField,
    updateField,
    removeField,
    reorderFields,
    resetBuilder,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;