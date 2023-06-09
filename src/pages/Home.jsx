import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/helper';
import { Backdrop, Box, Button, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormHelperText, InputAdornment, LinearProgress, Modal, TextField, Tooltip, Typography, styled } from '@mui/material';
import axios from 'axios';
import { Add, Delete, Description, Settings, Title } from '@mui/icons-material';
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_BASE_URL;
const Home = () => {
    const navigate = useNavigate()
    const auth = checkLogin();
    const [cardTodo, setCardTodo] = useState({});
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const CreateButton = styled(Button)(({ theme }) => ({
        color: 'white',
        fontWeight: '600',
        fontSize: '20px',
            // background: 'linear-gradient(90deg, rgba(57,179,137,1) 25%, rgba(22,21,21,1) 89%)',
            background: '#414833',
            '&:hover': {
                // background: 'linear-gradient(90deg, rgba(22,21,21,1) 25%, rgba(57,179,137,1) 89%)',
                background: 'black',
            },
    }))
    
    
    useEffect(() => {
        getCardList();
    }, []);

    let getCardList = async () => {
        try {
            const cardTodo = await axios.get(`${url}/card-todo`,{
                headers: { Authorization: `Bearer ${auth.jwt}` }
            })
            
            cardTodo?.status === 200 && setLoading(false);
            setCardTodo(cardTodo.data.data);
        } catch (error) {
            setLoading(!loading)
            if (error.response.data.message.includes('Token')) {
                navigate('/login');
                toast.error(error.response.data.message)
                localStorage.clear();
            }
        }
    }
    
    let createCard = async () => { 
        setLoading(!loading)
        try {
            const cardTodo = await axios.post(`${url}/card-todo`, {user_id: auth.user}, {
                headers: { Authorization: `Bearer ${auth.jwt}` }
            })
            getCardList();
            toast.success('Successfully added card')
        } catch (error) {
            setLoading(!loading)
            if (error.response.data.message.includes('Token')) {
                navigate('/login');
                toast.error(error.response.data.message)
                localStorage.clear();
            }
        }
    }

    let DeleteCard = async (id) => { 
        setLoading(!loading)
        try {
            const cardTodo = await axios.delete(`${url}/card-todo/${id}`, {
                headers: { Authorization: `Bearer ${auth.jwt}` }
            })
            getCardList();  
            toast.success('Successfully deleted card')
        } catch (error) {
            setLoading(!loading)
            if (error.response.data.message.includes('Token')) {
                navigate('/login');
                toast.error(error.response.data.message)
                localStorage.clear();
            }
        }
    }

    let deleteTodo = async (id) => { 
        setLoading(!loading)
        try {
            const cardTodo = await axios.delete(`${url}/todo/${id}`, {
                headers: { Authorization: `Bearer ${auth.jwt}` }
            })
            getCardList();            
            toast.success('Successfully deleted todo')
        } catch (error) {
            setLoading(!loading)
            if (error.response.data.message.includes('Token')) {
                navigate('/login');
                toast.error(error.response.data.message)
                localStorage.clear();
            }
        }
    }

    const handleOpen = (id) => {
        let keys = { ['card_todo_id']: id };
        setFormData({ ...formData, ...keys });
        setOpen(!open);
    };

    let handleChange = (e) => {
        let keys = { [e.target.name]: e.target.value };
        setFormData({ ...formData, ...keys });
    }
    
    function submitTodo() {
        let errors = [];
        if (formData?.title?.length < 3 || formData?.title === undefined) {
            errors['title'] = 'title is required at least 2 characters';
        }
        if (formData?.description?.length < 3 || formData?.description === undefined) {
            errors['description'] = 'description is required at least 2 characters';
        }
    
        setErrors(errors); 
        if (Object.keys(errors).length === 0) {
          onSubmitTodo();
        }
    }

    const onSubmitTodo = async () => {
        setLoading(!loading)
        let data = {
            title: formData.title,
            description: formData.description,
            card_todo_id: formData.card_todo_id,
        }
          
        try {
            const todo = await axios.post(`${url}/todo`, data, {
                headers: { Authorization: `Bearer ${auth.jwt}` }
            })
            getCardList();
            setOpen(!open);
            toast.success('Todo created!')
        } catch (error) {
            setLoading(!loading)
            toast.error(JSON.stringify(error?.response?.data?.error), {
                toastId: "errorLogin",
                theme: "dark",
            });
        }
    }  
    
    const logout = async () => {
        localStorage.clear()
        navigate('/login')
    }   

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                sx={{
                    height: "100vh", 
                    width: "100%", 
                    background: '#e9f5db',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography mt={5} mb={1} fontSize={28}> Your todo List </Typography>
                <Box sx={{display: 'flex', marginX: '10px'}}>
                    <Button onClick={() => createCard()} variant="contained">Add Card Todo</Button>
                    <Button sx={{ml: 5}} onClick={() => logout()} variant="contained">Logout</Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        ml: 4,
                        mt: 3,
                        pb: 5
                    }}
                >
                    {Array.isArray(cardTodo) && cardTodo.map((card) => (
                        <CardContent
                            sx={{
                                // width: '50%',
                                border: '1px solid gray',
                                borderRadius: '10px',
                                mt: 4,
                                mx: 1,
                                minHeight: '200px',
                                minWidth: '100px'
                            }}
                        >
                            <Box
                                sx={{
                                    background: 'gray',
                                    p: 1,
                                    marginTop: '-30px',
                                    display: 'flex',
                                    width: '90%',
                                    justifyContent: 'space-between',
                                    borderRadius: '5px'
                                }}
                            >
                                <Typography>{card?.card_code}</Typography>
                                <Tooltip onClick={() => handleOpen(card.card_todo_id)} title="Add Todo">
                                    <Add fontSize='20px' style={{color: 'white', paddingLeft: '20px', marginTop: '2px'}}/>
                                </Tooltip>
                                <Tooltip onClick={() => DeleteCard(card.card_todo_id) } title="Delete card">
                                    <Delete fontSize='20px' style={{color: 'maroon', paddingLeft: '5px', marginTop: '2px'}}/>
                                </Tooltip>
                            </Box>
                                <FormGroup style={{marginTop: '10px'}}>
                                {card.todos.map((todo) => (
                                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Tooltip title={todo.description}>
                                                <FormControlLabel control={<Checkbox />} label={todo.title} />
                                            </Tooltip>
                                            <Delete onClick={() => deleteTodo(todo.id)} style={{marginTop: '13px', cursor: 'pointer'}} fontSize='20px' htmlColor='maroon' />                                      
                                        </Box>
                                    ))}
                                </FormGroup>
                        </CardContent>
                    ))}                
                </Box> 
            </Box>

            <Modal
                open={open}
                onClose={handleOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <form>
                    <FormControl sx={{mt: '20px', width: '100%'}}>
                        <TextField
                            required
                            onChange={handleChange}
                            id="title" 
                            name="title" 
                            aria-describedby="my-helper-text" 
                            variant="outlined"
                            label="title"
                            sx={{ 
                                outlineColor: 'white', 
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Title />
                                </InputAdornment>
                                ),
                            }}
                        />
                        <FormHelperText id="title" sx={{ color: 'red' }}>{errors?.title}</FormHelperText>
                    </FormControl>
                        
                    <FormControl sx={{mt: '20px', width: '100%'}}>
                        <TextField
                        required
                        onChange={handleChange}
                        id="description" 
                        name="description" 
                        aria-describedby="my-helper-text" 
                        variant="outlined"
                        label="description"
                        sx={{ 
                            outlineColor: 'white', 
                        }}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <Description />
                            </InputAdornment>
                            ),
                        }}
                        />
                        <FormHelperText id="description" sx={{ color: 'red' }}>{errors?.description}</FormHelperText>
                    </FormControl>
                    
                    <FormControl sx={{ mt: '20px', width: '100%' }}>
                        <CreateButton
                            variant="contained"
                            onClick={() => submitTodo()}
                            type="submit"
                        >
                            Register
                        </CreateButton>            
                    </FormControl>
                </form>
            </Box>
            </Modal>
        
        </>
    );
}

export default Home;
