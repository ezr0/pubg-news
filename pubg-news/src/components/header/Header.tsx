import React from 'react'
import { useColorScheme } from '@mui/joy/styles'

import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeIcon from '@mui/icons-material/LightMode'
import Grid from '@mui/joy/Grid'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'

const Header = () => {
    const { mode, setMode } = useColorScheme()

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
                <img src={require('../../assets/images/logo.png')} alt="Logo" height="35px" />
            </Grid>
            <Grid
                xs={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
            >
                <Avatar
                    sx={{
                        mr: 1,
                    }}
                    variant="outlined"
                    size="sm"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box
                    sx={{
                        mr: 2,
                    }}
                >
                    <Typography level="title-sm">Craig Nelson</Typography>
                    <Typography level="body-xs">craignelson88@googlemail.com</Typography>
                </Box>
                <IconButton variant="outlined" color="neutral" size="md" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                    {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeIcon />}
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default Header
