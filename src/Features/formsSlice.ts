// src/features/formsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema } from '../Types/form';

interface FormsState {
    forms: FormSchema[];
}

const initialState: FormsState = {
    forms: [],
};

const formsSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        saveForm: (state, action: PayloadAction<FormSchema>) => {
            state.forms.push(action.payload);
            
            localStorage.setItem('forms', JSON.stringify(state.forms));
        },
        loadForms: (state) => {
            const storedForms = localStorage.getItem('forms');
            if (storedForms) {
                state.forms = JSON.parse(storedForms);
            }
        },
    },
});

export const { saveForm, loadForms } = formsSlice.actions;
export default formsSlice.reducer;