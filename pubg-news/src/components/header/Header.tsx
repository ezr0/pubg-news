import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorScheme } from '@mui/joy/styles'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import Dropdown from '@mui/joy/Dropdown'
import Grid from '@mui/joy/Grid'
import IconButton from '@mui/joy/IconButton'
import LightModeIcon from '@mui/icons-material/LightMode'
import ListDivider from '@mui/joy/ListDivider'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import Menu from '@mui/joy/Menu'
import MenuButton from '@mui/joy/MenuButton'
import MenuItem from '@mui/joy/MenuItem'
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

    const handleLogout = () => {
        localStorage.removeItem('user')
        setActiveUser(null)
        navigate('/')
    }

    const logoImage = mode === 'light' ? 'logo.png' : 'logo.png'

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
                        <IconButton sx={{ mr: 2 }} variant="outlined" color="neutral" size="md" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeIcon />}
                        </IconButton>
                        <Dropdown>
                            <MenuButton variant="plain" size="sm" sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}>
                                <Avatar
                                    sx={{
                                        maxWidth: '32px', 
                                        maxHeight: '32px'
                                    }}
                                    src={activeUser.photoURL}
                                />
                            </MenuButton>
                            <Menu
                                placement="bottom-end"
                                size="sm"
                                sx={{
                                    zIndex: '99999',
                                    p: 1,
                                    gap: 1,
                                    '--ListItem-radius': 'var(--joy-radius-sm)',
                                }}
                            >
                                <MenuItem>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Avatar src={activeUser.photoURL} sx={{ borderRadius: '50%' }} />
                                        <Box sx={{ ml: 1.5 }}>
                                            <Typography level="title-sm" textColor="text.primary">
                                                {activeUser.displayName}
                                            </Typography>
                                            <Typography level="body-xs" textColor="text.tertiary">
                                                {activeUser.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                                <ListDivider />
                                <MenuItem component="a" href="/user-profile">
                                    <AccountCircleOutlinedIcon />
                                    User Profile
                                </MenuItem>
                                <ListDivider />
                                <MenuItem onClick={handleLogout}>
                                    <LogoutOutlinedIcon />
                                    Log out
                                </MenuItem>
                            </Menu>
                        </Dropdown>
                    </>
                ) : (
                    <Button sx={{ mr: 1 }} onClick={handleLogin}>
                        Login
                    </Button>
                )}
            </Grid>
        </Grid>
    )
}

export default Header
