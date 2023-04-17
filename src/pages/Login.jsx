import { Box, Button, CircularProgress, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, inputLabelClasses, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import { AccountCircle, ArrowCircleRight, Email, PasswordTwoTone, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { checkLogin } from "../helper/helper";

const url = import.meta.env.VITE_BASE_URL;
const Login = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const auth = checkLogin();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginPage, setLoginPage] = useState(true);
  const [loading, setLoading] = useState(false);


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
    if (auth !== null) {
      navigate('/home');
    }
  }, []);

  let handleChange = (e) => {
    let keys = { [e.target.name]: e.target.value };
    setFormData({ ...formData, ...keys });
  }
  
  function submitLogin() {
    setLoading(true)
    let errors = {};
    if (formData?.email?.length < 3 || formData.email === undefined) {
        errors['email'] = 'email is required at least 2 characters';
    }
    if (formData?.password?.length < 3 || formData.password === undefined) {
        errors['password'] = 'password is required at least 8 characters';
    }
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      loginRequest();
    }
  }

  function submitRegister() {
    setLoading(true)
    let errors = [];
    if (formData?.email?.length < 8 || formData?.email === undefined) {
        errors['email'] = 'email is required';
    }
    if (formData?.name?.length < 3 || formData?.name === undefined) {
        errors['name'] = 'name is required at least 2 characters';
    }
    if (formData?.password?.length < 3 || formData?.password === undefined) {
        errors['password'] = 'password is required at least 8 characters';
    }

    setErrors(errors); 
    if (Object.keys(errors).length === 0) {
      onClickRegister();
    }
  }

  const onClickRegister = async () => {
    if (formData.password !== formData?.password_confirmation) {
      toast("Password didn't match!")
    } else {
      let data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData?.password_confirmation
      }
      
      try {
        const response = await axios.post(`${url}/register`, data)
        setLoginPage(!loginPage)
        setLoading(false)
        toast.success('User created succesfully!')
      } catch (error) {
        toast.error(JSON.stringify(error?.response?.data?.error), {
            toastId: "errorLogin",
            theme: "dark",
        });
      }
    }
  }

  let loginRequest = async () => { 
    try {
      const response = await axios.post(`${url}/login`, {
        email: formData.email,
        password: formData.password
      })
      const date = new Date();
      date.setDate(date.getDate() + 7);
      window.localStorage.setItem('session', JSON.stringify({
        user: response.data.data.user_id, jwt: response.data.data.token, path: "/login", expires: date
      }));
      setLoading(false);
      toast.success("Wellcome Home", {
          toastId: "loginSuccess",
          theme: "dark",
      });
      navigate("/home");
    } catch (error) {
      setError(error.response.data.message);
        toast.error(error.response.data.message, {
            toastId: "errorLogin",
            theme: "dark",
        });
      
        localStorage.clear();
        navigate("/login");
    }
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  return (
    <Box
      sx={{
        height: "100vh", 
        width: "100%", 
        // background: 'linear-gradient(-5deg, rgba(255,255,255,1) 7%, rgba(0,0,0,1) 82%)',
        background: '#e9f5db',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: "50%", 
          background: '#e9f5db',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loginPage === true ? (
          // login part
          <Box
            sx={{
              width: '50%',
              border: '1px solid gray',
              borderRadius: '10px',
              p: 3
            }}
          >
            <Box>
              <Typography fontSize={20}>Login</Typography>
            </Box>
            <form>
              <FormControl sx={{mt: '20px', width: '100%'}}>
                <TextField
                  required
                  onChange={handleChange}
                  id="email" 
                  name="email" 
                  aria-describedby="my-helper-text" 
                  variant="outlined"
                  label="email"
                  sx={{ 
                    outlineColor: 'white', 
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                  <FormHelperText id="email" sx={{ color: 'red' }}>{errors?.email}</FormHelperText>
              </FormControl>

              <FormControl sx={{mt: '20px',  width: '100%'}}>
                <TextField            
                  variant="outlined" 
                  label='password' 
                  onChange={handleChange} 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  aria-describedby="my-helper-text"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordTwoTone />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}

                />
                  <FormHelperText id="password" sx={{ color: 'red' }}>{errors?.password}</FormHelperText>
              </FormControl>
              
              <Typography color='red' fontSize={12}>{error}</Typography>
              
              <FormControl sx={{mt: '20px',  width: '100%'}}>
                {loading === false  ? (
                  <CreateButton
                    variant="contained"
                    onClick={() => submitLogin()}
                    type="submit"
                  >
                    Login
                  </CreateButton>  
                ) : (<CircularProgress style={{margin: '0 auto'}} color="secondary" />)}
              </FormControl>
            </form>
            <Box>
              <Typography>Dont have account? <Link to="#register" onClick={() => setLoginPage(!loginPage)} style={{textDecoration: 'none'}}>Register here</Link></Typography>
            </Box>
          </Box>
        ) : (
          // Register Part
          <Box
            sx={{
              width: '50%',
              border: '1px solid gray',
              borderRadius: '10px',
              p: 3
            }}
          >
            <Typography>
              <form>
                  <FormControl sx={{mt: '20px', width: '100%'}}>
                    <TextField
                      required
                      onChange={handleChange}
                      id="name" 
                      name="name" 
                      aria-describedby="my-helper-text" 
                      variant="outlined"
                      label="name"
                      sx={{ 
                        outlineColor: 'white', 
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                      <FormHelperText id="email" sx={{ color: 'red' }}>{errors?.name}</FormHelperText>
                  </FormControl>
                  <FormControl sx={{mt: '20px', width: '100%'}}>
                    <TextField
                      required
                      onChange={handleChange}
                      id="email" 
                      name="email" 
                      aria-describedby="my-helper-text" 
                      variant="outlined"
                      label="email"
                      sx={{ 
                        outlineColor: 'white', 
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                      <FormHelperText id="email" sx={{ color: 'red' }}>{errors?.email}</FormHelperText>
                  </FormControl>
                  <FormControl sx={{mt: '20px',  width: '100%'}}>
                    <TextField            
                      variant="outlined" 
                      label='password' 
                      onChange={handleChange} 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      aria-describedby="my-helper-text"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordTwoTone />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}

                    />
                      <FormHelperText id="password" sx={{ color: 'red' }}>{errors?.password}</FormHelperText>
                  </FormControl>

                  <FormControl sx={{mt: '20px',  width: '100%'}}>
                    <TextField            
                      variant="outlined" 
                      label='password_confirmation' 
                      onChange={handleChange} 
                      id="password_confirmation" 
                      type={showPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      aria-describedby="my-helper-text"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordTwoTone />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}

                    />
                      <FormHelperText id="password" sx={{ color: 'red' }}>{errors?.password}</FormHelperText>
                  </FormControl>
                
                
                  <Typography color='red' fontSize={12}>{error}</Typography>
                  <FormControl sx={{ mt: '20px', width: '100%' }}>
                  
                    {loading === false ? (
                      <CreateButton
                        variant="contained"
                        onClick={() => submitRegister()}
                        type="submit"
                      >
                      Register
                      </CreateButton>
                    ) : (<CircularProgress style={{margin: '0 auto'}} color="secondary" />)}
                  </FormControl>
                  <Box>
                    <Typography>Already have account? <Link to="" onClick={() => setLoginPage(!loginPage)} style={{textDecoration: 'none'}}>Login</Link></Typography>
                  </Box>
                  
              </form>
            </Typography>
          </Box>
        )}

      </Box>
    </Box>
  );
};

export default Login;
