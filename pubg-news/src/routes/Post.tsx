import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
// @ts-ignore
import db from '../firebase.js'
// @ts-ignore
import generateId from '../utils/generateId'
// @ts-ignore
import getTimeDifference from '../utils/getTimeDifference'

import AspectRatio from '@mui/joy/AspectRatio'
import Avatar from '@mui/joy/Avatar'
import Badge from '@mui/joy/Badge'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import CardOverflow from '@mui/joy/CardOverflow'
import Chip from '@mui/joy/Chip'
import Divider from '@mui/joy/Divider'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import Header from '../components/header/Header'
import IconButton from '@mui/joy/IconButton'
import Input from '@mui/joy/Input'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'

const Post = () => {
    const location = useLocation()
    const postData = location.state

    const [activeUser, setActiveUser] = useState({ uid: '', displayName: '', photoURL: '' })
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState<any[]>([])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) {
            setActiveUser({ uid: '', displayName: '', photoURL: '' })
        } else {
            setActiveUser(user)
        }
    }, [])

    useEffect(() => {
        if (postData && postData.comments) {
            setComments(postData.comments)
        }
    }, [postData])

    useEffect(() => {
        if (postData && postData.comments) {
            const updatedComments = postData.comments.map((comment: { likedBy: any; dislikedBy: any }) => ({
                ...comment,
                likedBy: comment.likedBy || [],
                dislikedBy: comment.dislikedBy || [],
            }))
            setComments(updatedComments)
        }
    }, [postData])

    const toggleComments = () => {
        setShowComments(!showComments)
    }

    const handleNewCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value)
    }

    const handleAddComment = async () => {
        const id = generateId()
        const postRef = doc(db, 'posts', postData.id)
        const commentData = {
            id: id,
            uid: activeUser.uid,
            displayName: activeUser.displayName || '',
            photoURL: activeUser.photoURL || '',
            created: new Date().toUTCString(),
            content: newComment,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
        }

        //* Update Firestore with new comment
        await updateDoc(postRef, {
            comments: [...comments, commentData],
        })

        //* Update local state with new comment
        setComments([...comments, commentData])
        setNewComment('')
    }

    const handleVote = async (id: string, type: string) => {
        const postRef = doc(db, 'posts', postData.id);
        const updatedComments = comments.map(comment => {
            if (comment.id === id) {
                if (type === 'like') {
                    if (!comment.likedBy.includes(activeUser.uid)) {
                        comment.likes++;
                        comment.likedBy.push(activeUser.uid);
                        // Remove user from dislikedBy if already disliked
                        comment.dislikedBy = comment.dislikedBy.filter((uid: string) => uid !== activeUser.uid);
                    } else {
                        // Unlike if already liked
                        comment.likes--;
                        comment.likedBy = comment.likedBy.filter((uid: string) => uid !== activeUser.uid);
                    }
                } else if (type === 'dislike') {
                    if (!comment.dislikedBy.includes(activeUser.uid)) {
                        comment.dislikes++;
                        comment.dislikedBy.push(activeUser.uid);
                        // Remove user from likedBy if already liked
                        comment.likedBy = comment.likedBy.filter((uid: string) => uid !== activeUser.uid);
                    } else {
                        // Remove dislike if already disliked
                        comment.dislikes--;
                        comment.dislikedBy = comment.dislikedBy.filter((uid: string) => uid !== activeUser.uid);
                    }
                }
            }
            return comment;
        });
    
        // Update Firestore with updated comments
        await updateDoc(postRef, { comments: updatedComments });
        
        // Update local state with updated comments
        setComments(updatedComments);
    };    

    const isLiked = (comment: any) => comment.likedBy.includes(activeUser.uid)
    const isDisliked = (comment: any) => comment.dislikedBy.includes(activeUser.uid)

    return (
        <>
            <Header />
            <Sheet sx={{ p: 2 }}>
                <Card
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
                            <img alt="" src={postData.image} />
                            <Stack alignItems="center" direction="row" sx={{ position: 'absolute', top: 0, width: '100%', p: 1 }}>
                                {postData.popularPost && (
                                    <Chip variant="soft" color="success" startDecorator={<WorkspacePremiumRoundedIcon />} size="md">
                                        Popular Post!
                                    </Chip>
                                )}
                                <IconButton
                                    variant="plain"
                                    size="sm"
                                    color={postData.isLiked ? 'danger' : 'neutral'}
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
                                <Typography level="body-sm">{postData.category}</Typography>
                                <Typography level="title-md">{postData.title}</Typography>
                            </div>
                            <Stack direction="row" alignItems="center">
                                <IconButton
                                    variant="plain"
                                    size="sm"
                                    color={postData.isLiked ? 'danger' : 'neutral'}
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' },
                                        borderRadius: '50%',
                                    }}
                                >
                                    <FavoriteRoundedIcon />
                                </IconButton>
                                <Badge size="sm" badgeContent={postData.comments.length > 0 ? postData.comments.length.toString() : '0'} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                    <MessageOutlinedIcon onClick={toggleComments} />
                                </Badge>
                            </Stack>
                        </Stack>
                        <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ my: 2 }}>
                            <Typography level="body-sm">{postData.description}</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ mt: 'auto' }}>
                            <Typography level="title-sm" sx={{ flexGrow: 1, textAlign: 'left' }}>
                                <strong>{postData.datePosted}</strong>
                            </Typography>
                            {postData.tags.map((tag: any, index: any) => (
                                <Chip key={index} variant="soft" color="primary" size="md" sx={{ marginLeft: '4px' }}>
                                    <b>{tag.label}</b>
                                </Chip>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
                <div style={{ display: 'flex', justifyContent: showComments ? 'space-between' : 'end', marginTop: '20px', marginBottom: '20px' }}>
                    {showComments && (
                        <div style={{ display: 'flex' }}>
                            <Input type="text" value={newComment} onChange={handleNewCommentChange} sx={{ mr: 2 }} />
                            <Button onClick={handleAddComment}>Post</Button>
                        </div>
                    )}
                    <Button onClick={toggleComments}>{showComments ? 'Hide Comments' : 'Show Comments'}</Button>
                </div>
                {showComments && (
                    <div>
                        <Typography level="body-md">Comments</Typography>
                        <Divider sx={{ mb: 4 }} />
                        {comments.map((comment, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'start', marginBottom: '8px' }}>
                                <Avatar alt={comment.displayName} src={comment.photoURL} />
                                <div style={{ marginLeft: '8px' }}>
                                    <Stack direction="row" alignItems="center">
                                        <Typography level="body-sm" component="span" sx={{ fontWeight: 'bold' }}>
                                            {comment.displayName}
                                        </Typography>
                                        <Typography level="body-xs" sx={{ ml: 1, color: 'text.disabled' }}>
                                            {getTimeDifference(comment.created)}
                                        </Typography>
                                    </Stack>
                                    <Typography level="body-sm" component="p" sx={{ mt: 1, mb: 0 }}>
                                        {comment.content}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 4, display: 'flex' }}>
                                        <Badge size="sm" badgeContent={comment.likes.toString()} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                                            <ThumbUpAltOutlinedIcon onClick={() => handleVote(comment.id, 'like')} color={isLiked(comment) ? 'success' : 'info'} sx={{ mr: 1 }} />
                                        </Badge>
                                        <Badge size="sm" badgeContent={comment.dislikes.toString()} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                            <ThumbDownOutlinedIcon onClick={() => handleVote(comment.id, 'dislike')}  color={isDisliked(comment) ? 'success' : 'info'} />
                                        </Badge>
                                    </Stack>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Sheet>
        </>
    )
}

export default Post
