import React, { useState, useEffect } from 'react'
import { getAuth, updateProfile, updateEmail, updatePassword, User } from 'firebase/auth'

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import Alert from '../../components/alert/Alert'
import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import Divider from '@mui/joy/Divider'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import FormControl from '@mui/joy/FormControl'
import Header from '../../components/header/Header'
import IconButton from '@mui/joy/IconButton'
import Input from '@mui/joy/Input'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'

interface AlertState {
    color: 'success' | 'warning' | 'danger' | 'neutral'
    text: string
}

interface UserDetails {
    displayName: string
    email: string
    photoURL: string
}

const UserProfile = () => {
    const [activeUser, setActiveUser] = useState<UserDetails | null>(null)
    const [displayName, setDisplayName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [alert, setAlert] = useState<AlertState | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isModified, setIsModified] = useState(false)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') as string)
        if (user) {
            setActiveUser(user)
        }
    }, [])

    const handleUpdate = async () => {
        try {
            setIsLoading(true)
            const auth = getAuth();
            const currentUser: User | null = auth.currentUser;
            
            if (!currentUser) {
                throw new Error('User not signed in.');
            }
            
            if (password !== confirmPassword) {
                setAlert({ color: 'danger', text: "Passwords don't match" });
                setIsLoading(false);
                return;
            }
            
            await updateProfile(currentUser, {
                displayName: displayName || currentUser.displayName,
                photoURL: currentUser.photoURL,
            });
            
            if (email !== currentUser.email) {
                await updateEmail(currentUser, email);
            }
            
            if (password) {
                await updatePassword(currentUser, password);
            }
            
            setAlert({ color: 'success', text: 'User updated' });
            setIsLoading(false);

            //* Update localStorage with new user
            localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error: any) {
            setIsLoading(false)
            setAlert({ color: 'danger', text: error.message })
        }
    }

    const handleInputChange = () => {
        if (!isModified) {
            setIsModified(true);
        }
    };

    return (
        <>
            <Header />
            {alert && <Alert color={alert.color} text={alert.text} />}
            <Stack
                spacing={4}
                sx={{
                    display: 'flex',
                    maxWidth: '800px',
                    mx: 'auto',
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Card
                    sx={(theme) => ({
                        backgroundColor: 'rgba(255 255 255 / 0.2)',
                        [theme.getColorSchemeSelector('dark')]: {
                            backgroundColor: 'rgba(19 19 24 / 1)',
                        },
                    })}
                >
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">User profile</Typography>
                        <Typography level="body-sm">Customize your profile information</Typography>
                    </Box>
                    <Divider />
                    <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}>
                        <Stack direction="column" spacing={1}>
                            <AspectRatio ratio="1" maxHeight={200} sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}>
                                <img src={activeUser?.photoURL} loading="lazy" alt="" />
                            </AspectRatio>
                            <IconButton
                                aria-label="upload new picture"
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                sx={{
                                    bgcolor: 'background.body',
                                    position: 'absolute',
                                    zIndex: 2,
                                    borderRadius: '50%',
                                    left: 100,
                                    top: 170,
                                    boxShadow: 'sm',
                                }}
                            >
                                <EditRoundedIcon />
                            </IconButton>
                        </Stack>
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <Stack spacing={2}>
                                    <FormControl>
                                        <Input size="md" placeholder={activeUser?.displayName ? activeUser?.displayName : 'Display Name'} startDecorator={<AccountCircleOutlinedIcon />} value={displayName} onChange={(e) => { setDisplayName(e.target.value); handleInputChange(); }} />
                                    </FormControl>
                                    <FormControl>
                                        <Input size="md" type="email" startDecorator={<EmailRoundedIcon />} placeholder={activeUser?.email ? activeUser?.email : 'Email'} value={email} onChange={(e) => { setEmail(e.target.value); handleInputChange(); }} />
                                    </FormControl>
                                    <FormControl>
                                        <Input size="md" type="password" startDecorator={<LockOutlinedIcon />} placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); handleInputChange(); }} />
                                    </FormControl>
                                    <FormControl>
                                        <Input size="md" type="password" startDecorator={<LockResetOutlinedIcon />} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); handleInputChange(); }} />
                                    </FormControl>
                                </Stack>
                                <Button color="success" onClick={handleUpdate} loading={isLoading} disabled={!isModified}>
                                    Update
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
        </>
    )
}

export default UserProfile
