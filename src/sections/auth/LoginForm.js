import React , { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { Link as RouterLink , useNavigate} from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

  //validation rules
  const loginSchema = Yup.object().shape({
    email:Yup.string().required('Email is required').email('Email must be a valid email address'),
    password:Yup.string().required('Password is required')
  });

  const defaultValues = {
    email:'dulanjali@gmail.com',
    password:'dula@123'
  };

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues
  });

  const {reset, setError, handleSubmit, formState:{errors, isSubmitting, isSubmitSuccessful}}
   = methods;

    const onSubmit = async (data) => {
        const { email, password } = data; // get data from form
        setError('afterSubmit', {}); // clear previous errors
        setLoading(true);

        try {
            // Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Redirect to the welcome page
            navigate('/welcome', { replace: true });
        } catch (error) {
            console.error(error);
            setError('afterSubmit', {
                type: 'manual',
                message: error.message, // show Firebase error
            });
        } finally {
            setLoading(false);
        }
    };


    return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
            {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

        <RHFTextField name='email' label='Email address'/>
        <RHFTextField name='password' label='Password' type={showPassword ? 'text' : 'password'}
        InputProps={{endAdornment:(
            <InputAdornment>
            <IconButton onClick={()=>{
                setShowPassword(!showPassword);
            }}>
                {showPassword ? <Eye/>: <EyeSlash/>}
            </IconButton>
            </InputAdornment>
        )}}/>
        </Stack>
        <Stack alignItems={'flex-end'} sx={{my:2}}>
            <Link component={RouterLink} to='/auth/reset-password'
             variant='body2' color='inherit' underline='always'>Forgot Password?</Link>
        </Stack>
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800',
         '&:hover':{
            bgcolor:'text.primary',
            color:(theme)=> theme.palette.mode === 'light' ? 'common.white':'grey.800',
         }}}
                disabled={loading}
         >Login</Button>
    </FormProvider>
  )
}

export default LoginForm
