import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AspectRatio from '@mui/joy/AspectRatio'
import Badge from '@mui/joy/Badge'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import CardOverflow from '@mui/joy/CardOverflow'
import Chip from '@mui/joy/Chip'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import IconButton from '@mui/joy/IconButton'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'

type PostProps = {
    id: string
    category: React.ReactNode
    description: string
    image: string
    liked?: boolean
    popularPost?: boolean
    title: React.ReactNode
    datePosted: string
    comments: CommentType[]
    tags: TagType[]
}

type CommentType = {
    id: string
    uid: string
    displayName: string
    photoURL: string
    created: string
    content: string
}

type TagType = {
    label: string
}

const PostCard = (props: PostProps) => {
    const { category, title, popularPost = false, liked = false, image, datePosted, comments, tags } = props
    const [isLiked, setIsLiked] = useState(liked)
    const navigate = useNavigate()

    const handlePostClick = () => {
        navigate(`/post/${props.id}`, { state: props })
    }

    return (
        <Card
            onClick={handlePostClick}
            variant="outlined"
            orientation="horizontal"
            sx={{
                bgcolor: 'neutral.softBg',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 'lg',
                    borderColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
                },
            }}
        >
            <CardOverflow
                sx={{
                    mr: { xs: 'var(--CardOverflow-offset)', sm: 0 },
                    mb: { xs: 0, sm: 'var(--CardOverflow-offset)' },
                    '--AspectRatio-radius': {
                        xs: 'calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0',
                        sm: 'calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0 calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px))',
                    },
                }}
            >
                <AspectRatio
                    ratio="1"
                    flex
                    sx={{
                        minWidth: { sm: 120, md: 160 },
                        '--AspectRatio-maxHeight': { xs: '160px', sm: '9999px' },
                    }}
                >
                    <img alt="" src={image} />
                    <Stack alignItems="center" direction="row" sx={{ position: 'absolute', top: 0, width: '100%', p: 1 }}>
                        {popularPost && (
                            <Chip variant="soft" color="success" startDecorator={<WorkspacePremiumRoundedIcon />} size="md">
                                Popular Post!
                            </Chip>
                        )}
                        <IconButton
                            variant="plain"
                            size="sm"
                            color={isLiked ? 'danger' : 'neutral'}
                            onClick={() => setIsLiked((prev) => !prev)}
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                ml: 'auto',
                                borderRadius: '50%',
                                zIndex: '20',
                            }}
                        >
                            <FavoriteRoundedIcon />
                        </IconButton>
                    </Stack>
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start">
                    <div>
                        <Typography level="body-sm">{category}</Typography>
                        <Typography level="title-md">{title}</Typography>
                    </div>
                    <Stack direction="row" alignItems="center">
                        <IconButton
                            variant="plain"
                            size="sm"
                            color={isLiked ? 'danger' : 'neutral'}
                            onClick={() => setIsLiked((prev) => !prev)}
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                borderRadius: '50%',
                            }}
                        >
                            <FavoriteRoundedIcon />
                        </IconButton>
                        <Badge size="sm" badgeContent={comments.length > 0 ? comments.length.toString() : '0' } color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <MessageOutlinedIcon />
                        </Badge>
                    </Stack>
                </Stack>
                <Stack direction="row" sx={{ mt: 'auto' }}>
                    <Typography level="title-sm" sx={{ flexGrow: 1, textAlign: 'left' }}>
                        <strong>{datePosted}</strong>
                    </Typography>
                    {tags.map((tag, index) => (
                        <Chip key={index} variant="soft" color="primary" size="md" sx={{ marginLeft: '4px' }}>
                            <b>{tag.label}</b>
                        </Chip>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    )
}

export default PostCard
