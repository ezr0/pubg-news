import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorScheme } from '@mui/joy/styles'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeIcon from '@mui/icons-material/LightMode'
import Grid from '@mui/joy/Grid'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'

interface UserDetails {
    displayName: string
    email: string
    photoURL: string
}

const Header = () => {
    const navigate = useNavigate()
    const { mode, setMode } = useColorScheme()
    const [activeUser, setActiveUser] = useState<UserDetails | null>(null)

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user') || 'null')
        if (!userDetails) {
            setActiveUser(null)
        } else {
            setActiveUser(userDetails as UserDetails)
        }
    }, [])

    const handleLogin = () => {
        navigate('/login')
    }

    const logoImage = mode === 'light' ? 'logo-black.png' : 'logo.png'

    return (
        <Grid
            sx={(theme) => ({
                backgroundColor: 'rgba(255 255 255 / 0.2)',
                [theme.getColorSchemeSelector('dark')]: {
                    backgroundColor: 'rgba(19 19 24 / 1)',
                },
                padding: '5px 10px',
            })}
            container
        >
            <Grid
                xs={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ cursor: 'pointer' }}>
                    <img src={require(`../../assets/images/${logoImage}`)} alt="Logo" height="35px" onClick={() => navigate('/')} />
                </Box>
            </Grid>
            <Grid
                xs={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
            >
                {activeUser ? (
                    <>
                        <Avatar
                            sx={{
                                mr: 1,
                            }}
                            variant="outlined"
                            size="sm"
                            src={activeUser.photoURL}
                        />
                        <Box
                            sx={{
                                mr: 2,
                            }}
                        >
                            <Typography level="title-sm">{activeUser.displayName}</Typography>
                            <Typography level="body-xs">{activeUser.email}</Typography>
                        </Box>
                    </>
                ) : (
                    <Button sx={{ mr: 1 }} onClick={handleLogin}>
                        Login
                    </Button>
                )}

                <IconButton variant="outlined" color="neutral" size="md" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                    {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeIcon />}
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default Header
