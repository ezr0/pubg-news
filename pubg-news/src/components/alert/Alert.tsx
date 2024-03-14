import React, { ReactNode, useEffect, useState } from 'react'

import Alert from '@mui/joy/Alert'
import Box from '@mui/joy/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton from '@mui/joy/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import ReportIcon from '@mui/icons-material/Report'
import WarningIcon from '@mui/icons-material/Warning'

interface CustomAlertProps {
    color: 'success' | 'warning' | 'danger' | 'neutral'
    text: string
}

const CustomAlert: React.FC<CustomAlertProps> = ({ color, text }) => {
    let startDecorator: ReactNode

    switch (color) {
        case 'success':
            startDecorator = <CheckCircleIcon />
            break
        case 'warning':
            startDecorator = <WarningIcon />
            break
        case 'danger':
            startDecorator = <ReportIcon />
            break
        case 'neutral':
            startDecorator = <InfoIcon />
            break
        default:
            startDecorator = null
            break
    }

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    const handleClose = () => {
        setVisible(false);
    }

    return (
        <>
            {visible && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        padding: '16px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'opacity 1.5s ease',
                        opacity: 1,
                        zIndex: 100
                    }}
                    style={{ opacity: visible ? 1 : 0 }}
                >
                    <Alert
                        variant="soft"
                        color={color}
                        startDecorator={startDecorator}
                        endDecorator={
                            <IconButton variant="soft" color={color} onClick={handleClose}>
                                <CloseRoundedIcon />
                            </IconButton>
                        }
                    >
                        {text}
                    </Alert>
                </Box>
            )}
        </>
    )
}

export default CustomAlert
