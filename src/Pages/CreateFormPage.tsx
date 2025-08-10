import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../App/store';
import { setFormName, addField, resetBuilder, reorderFields } from '../Features/formBuilderSlice';
import { saveForm } from '../Features/formsSlice';
import FieldEditor from '../Components/FieldEditor';
import { Grid, Box, Button, Container, TextField, Typography, AppBar, Toolbar } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const CreateFormPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { name, fields } = useSelector((state: RootState) => state.formBuilder);

   
    const onDragEnd = (result: DropResult) => {
       
        if (!result.destination) {
            return;
        }
       
        dispatch(reorderFields({
            startIndex: result.source.index,
            endIndex: result.destination.index,
        }));
    };

    const handleSaveForm = () => {
        let finalFormName = name.trim();
        if (finalFormName === 'Untitled Form' || finalFormName === '') {
            const newName = window.prompt("Please enter a name for your form:", "My New Form");
            if (!newName || newName.trim() === '') {
                alert("A valid form name is required to save.");
                return;
            }
            finalFormName = newName.trim();
        }
        const newForm = {
            id: uuidv4(),
            name: finalFormName,
            fields,
            createdAt: new Date().toISOString(),
        };
        dispatch(saveForm(newForm));
        dispatch(resetBuilder());
        navigate(`/myforms`);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Form Builder
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/myforms')}>My Forms</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>

                
                    <Grid item xs={12}>
                        <TextField
                            label="Form Name"
                            value={name}
                            onChange={(e) => dispatch(setFormName(e.target.value))}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                     
                        <DragDropContext onDragEnd={onDragEnd}>
                           
                            <Droppable droppableId="fields">
                                {(provided) => (
                                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                                        {fields.map((field, index) => (
                                            
                                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <FieldEditor field={field} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Grid>

                    
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Add New Fields</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Text', label: 'New Text Field' }))}>Add Text</Button>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Number', label: 'New Number Field' }))}>Add Number</Button>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Textarea', label: 'New Text Area' }))}>Add Text Area</Button>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Date', label: 'New Date Field' }))}>Add Date</Button>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Checkbox', label: 'New Checkbox' }))}>Add Checkbox</Button>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Select', label: 'New Select', options: [] }))}>Add Select</Button>
                            <Button variant="contained" onClick={() => dispatch(addField({ type: 'Radio', label: 'New Radio Group', options: [] }))}>Add Radio Group</Button>
                        </Box>
                    </Grid>

                   
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" onClick={handleSaveForm}>
                            Save Form
                        </Button>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default CreateFormPage;