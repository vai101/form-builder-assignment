import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { RootState } from '../App/store';
import { loadForms } from '../Features/formsSlice';
import {
    Container, Typography, List, ListItem, ListItemText, Box, AppBar, Toolbar, IconButton,
    ListItemButton // <-- Add this here
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const MyFormsPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { forms } = useSelector((state: RootState) => state.forms);

    useEffect(() => {
        dispatch(loadForms());
    }, [dispatch]);

    return (
        <Box>
            <AppBar position="static">
                 <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My Saved Forms
                    </Typography>
                    <IconButton color="inherit" onClick={() => navigate('/create')}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {forms.length === 0 ? (
                    <Typography>No forms saved yet. Go create one!</Typography>
                ) : (
                    <List>
                        {forms.map((form) => (
                            // 2. Remove `button` and `component` props from ListItem
                            <ListItem key={form.id} sx={{ p: 0, border: '1px solid #ddd', mb: 1 }}>
                                {/* 3. Add ListItemButton with the routing props */}
                                <ListItemButton component={RouterLink} to={`/preview/${form.id}`}>
                                    <ListItemText
                                        primary={form.name}
                                        secondary={`Created on: ${new Date(form.createdAt).toLocaleDateString()}`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default MyFormsPage;