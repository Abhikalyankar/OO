import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/auth/authThunk';
import { validateEmail, validatePassword } from '../../utils/helper';
import routes from '../../routes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import LoginForm from './components/LoginForm';
import FeatureShowcase from './components/FeatureShowcase';
import { Scan, Users, Car } from 'lucide-react';
import { toast } from 'react-toastify';
import RegisterForm from './components/RegisterForm';
import { register } from '../../store/auth/authThunk';


export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegistrationFormData {
  email: string;
  name: string;
  password1: string;
  password: string;

}

export interface FormErrors {
  username: string;
  password: string;
}

export interface FormErrors2 {
  email: string;
  name: string;
  password1: string;
  password: string;
}

export interface Feature {
  icon: React.FC<{ size?: number; color?: string }>;
  title: string;
  description: string;
}

// Features for Person, Vehicle, and Face Detection system
const detectionFeatures: Feature[] = [
  {
    icon: ({ size, color }) => <Users size={size} color={color} />,
    title: "Person Detection",
    description: "High-precision human detection and tracking with support for crowd analysis and monitoring.",
  },
  {
    icon: ({ size, color }) => <Car size={size} color={color} />,
    title: "Vehicle Recognition",
    description: "Identify and classify vehicles across multiple categories with advanced pattern recognition.",
  },
  {
    icon: ({ size, color }) => <Scan size={size} color={color} />,
    title: "Face Detection",
    description: "Privacy-focused facial detection with customizable confidence thresholds and attribute analysis.",
  },
];

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state: any) => state.auth.isAuthenticated);

  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [formData2, setFormData2] = useState<RegistrationFormData>({
    email: '',
    name: '',
    password1: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({ username: '', password: '' });
  const [errors2, setErrors2] = useState<FormErrors2>({ email: '', name: '', password1:'', password:'' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    document.title = showRegisterForm ? 'Register | Skylark Labs' : 'Login | Skylark Labs '
    if (isAuthenticated) {
      navigate(routes.home.path);
    }
  }, [isAuthenticated, navigate]);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

   // Add function to toggle between forms
  const handleToggleForm = () => {
    setShowRegisterForm(!showRegisterForm);
    // Reset form data and errors when switching
    setFormData({
      username: '',
      password: '',
      rememberMe: false,
    });

    setFormData2({
      email: '',
      name: '',
      password1: '',
      password:''
    });
    setErrors({ username: '', password: '' });
    setErrors2({email:'', name:'', password1:'', password:''})
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const inputValue = name === 'rememberMe' ? checked : value;

    if (showRegisterForm) {
      // Handle registration form fields
      setFormData2((prev) => ({ ...prev, [name]: inputValue }));
      if (errors2[name as keyof FormErrors2]) {
        setErrors2((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      // Handle login form fields
      setFormData((prev) => ({ ...prev, [name]: inputValue }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = validateEmail(formData.username);
    const passwordError = validatePassword(formData.password);

    setErrors({ username: emailError, password: passwordError });

    if (!showRegisterForm){
      if (emailError || passwordError) return;
    }
    setIsLoading(true);
    setFormError('');
    
    try {
      if (showRegisterForm) {
        if (formData2.password1 == formData2.password){
          const result = await dispatch(register(formData2)).unwrap();
          console.log("result is ", result)
          console.log(result.data)

          toast.info('Registration done!');
          navigate(routes.home.path);
          
          // console.log('Registration logic to be implemented');
          // toast.info('Registration functionality to be implemented');
        }
        else{
          toast.error("password not matching!");
        }
        
        // Handle registration logic here
        // You'll need to implement the registration API call
        
      } else {
        // Handle login logic
        const result = await dispatch(login(formData)).unwrap();
        console.log("result is ", result)
        console.log(result.data)
        if (result?.data?.token) {
          navigate(routes.home.path);
        } else {
          setFormError('Invalid username or password. Please try again.');
        }
      }
    } catch (error: any) {
    if (showRegisterForm) {
      toast.error('Registration failed. Please try again.');
    } else {
      // console.log("login errror", error?.error?.data?.Error[0]);
      toast.error(error?.error?.data?.Error[0] || "Unable to log in with provided credentials.");
    }
    setFormError('An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  //   try {
  //     const result = await dispatch(login(formData)).unwrap();
  //     if (result?.data?.token) {
  //       navigate(routes.home.path);
  //     } else {
  //       setFormError('Invalid username or password. Please try again.');
  //     }
  //   } catch (error:any) {
  //     console.log(error);
  //     toast.error(error?.error?.data?.Error[0] || "Unable to log in with provided credentials")
  //     setFormError('An error occurred. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {showRegisterForm ? (
        <RegisterForm
          formData={formData2}
          errors={errors2}
          formError={formError}
          isLoading={isLoading}
          showPassword={showPassword}
          onTogglePassword={handleTogglePassword}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onToggleForm={handleToggleForm}
        />
      ) : (
        <LoginForm
          formData={formData}
          errors={errors}
          formError={formError}
          isLoading={isLoading}
          showPassword={showPassword}
          onTogglePassword={handleTogglePassword}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onToggleForm={handleToggleForm}
        />
      )}
      <FeatureShowcase features={detectionFeatures} />
    </Box>
  );
};

export default Login;