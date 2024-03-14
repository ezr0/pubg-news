import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification  } from "firebase/auth";
import { useNavigate } from 'react-router-dom'

import Alert from '../../components/alert/Alert'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Divider from '@mui/joy/Divider'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import GlobalStyles from '@mui/joy/GlobalStyles'
import Header from '../../components/header/Header'
import Link from '@mui/joy/Link'
import Input from '@mui/joy/Input'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'

interface AlertState {
    color: 'success' | 'warning' | 'danger' | 'neutral';
    text: string;
}

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState<AlertState | null>(null);

    const handleRegistration = async (event: any) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setAlert({ color: 'danger', text: "Passwords don't match" });
            return;
        }
        try {
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    await sendEmailVerification(userCredential.user);
                    setAlert({ color: 'success', text: 'Please verify your email address.' })
                    setTimeout(() => {
                        navigate('/login')
                    }, 5000);
                }).catch((error) => {
                    setAlert({ color: 'danger', text: error.message })
                })
        } catch (error: any) {
            setAlert({ color: 'danger', text: error.message });
        }
    };

    return (
        <>  
            <Header />
            {alert && <Alert color={alert.color} text={alert.text} />}
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s',
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                    },
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >
                        <Stack gap={4} sx={{ mb: 2 }}>
                            <Stack gap={1}>
                                <Typography component="h1" level="h3">
                                    Register
                                </Typography>
                                <Typography level="body-sm">
                                    Already have an account?{' '}
                                    <Link href="/login" level="title-sm">
                                        Sign in!
                                    </Link>
                                </Typography>
                            </Stack>
                        </Stack>
                        <Divider
                            sx={(theme) => ({
                                [theme.getColorSchemeSelector('light')]: {
                                    color: { xs: '#FFF', md: 'text.tertiary' },
                                },
                            })}
                        >
                            or
                        </Divider>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <form onSubmit={handleRegistration}>
                                <FormControl required>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input type="password" name="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                                </FormControl>
                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Button type="submit" fullWidth>
                                        Register
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © PUBG News {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    zIndex: -1,
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition: 'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: 'url(https://i.postimg.cc/BbJPzKhS/1.jpg)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage: 'url(https://i.postimg.cc/BbJPzKhS/1.jpg)',
                    },
                })}
            />
        </>
    )
}

export default Register
