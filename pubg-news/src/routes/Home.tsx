import React from 'react'

import Box from '@mui/joy/Box'
import Header from '../components/header/Header'
import Grid from '@mui/joy/Grid'

const Home = () => {
    const userDetails = JSON.parse(localStorage.getItem('user') as string)
    console.log(userDetails)

    return (
        <main>
            <Header />
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
                    HOME
                </Box>
            </Grid>
            </Grid>
        </main>
    )
}

export default Home
