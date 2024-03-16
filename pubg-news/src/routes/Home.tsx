import React, { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
// @ts-ignore
import db from '../firebase.js';
// @ts-ignore
import generateId from '../utils/generateId';

import Alert from '../components/alert/Alert'
import Autocomplete from '@mui/joy/Autocomplete'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Header from '../components/header/Header'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Post from '../components/posts/post'
import Stack from '@mui/joy/Stack'
import Modal from '@mui/joy/Modal'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'

interface AlertState {
    color: 'success' | 'warning' | 'danger' | 'neutral'
    text: string
}

const Home = () => {
    const [alert, setAlert] = useState<AlertState | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const [newPostData, setNewPostData] = useState({ title: '', category: '', tags: '', image: '', comments: [] })
    const [activeUser, setActiveUser] = useState({ permissions: '' })
    const [image, setImage] = useState<File | null>(null)

    useEffect(() => {
        //* Get post data from firestore

        //* Get user from local storage
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) {
            setActiveUser({ permissions: '' })
        } else {
            setActiveUser(user)
        }
    }, [])

    const handleNewPost = () => {
        setOpenModal(true)
    }

    const handleTitle = (event: any) => {
        if (event && event.target) {
            setNewPostData({ ...newPostData, title: event.target.value });
        }
    }

    const handleTags = (event: any, newValue: any) => {
        setNewPostData({ ...newPostData, tags: newValue });
    }

    const handleCategory = (event: any) => {
        if (event && event.target) {
            setNewPostData({ ...newPostData, category: event.target.value });
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            setImage(file)
        }
    }

    const handleSubmit = async () => {
        debugger
        const id = generateId();
        let downloadURL = '';
    
        if (image) {
            try {
                const storage = getStorage()
                const storageRef = ref(storage, `posts/${id}}`)
                await uploadBytes(storageRef, image)
                downloadURL = await getDownloadURL(storageRef);
            } catch (error: any) {
                setAlert({ color: 'danger', text: error.message })
                return;
            }
        }
    
        await setDoc(doc(db, 'posts', id), {
            id: id,
            title: newPostData.title,
            category: newPostData.category,
            tags: newPostData.tags,
            image: downloadURL,
            comments: newPostData.comments,
            created: new Date().toUTCString(),
            updated: '',
            deleted: false
        });
        setOpenModal(false)
    }

    const handleModalClose = () => {
        setOpenModal(false)
    }

    const postTags = [
        { label: 'PC'},
        { label: 'Console'},
    ]

    return (
        <main>
            <Header />
            {alert && <Alert color={alert.color} text={alert.text} />}
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                {activeUser.permissions === 'super' && (
                    <Box display="flex" justifyContent="flex-end">
                        <Button onClick={handleNewPost}>New Post</Button>
                    </Box>
                )}
                <Stack spacing={2} sx={{ overflow: 'auto' }}>
                    <Post title="PUBG: BATTLEGROUNDS Weekly Bans Notice (03/04~03/10)" category="Announcement" popularPost image={require('../assets/images/weekly-bans.jpg')} datePosted="15/03/2024" comments={5} />
                    <Post title="March Store Update 2024" category="Announcement" liked image={require('../assets/images/march.jpg')} datePosted="15/03/2024" comments={10} />
                </Stack>
            </Stack>
            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400 }}>
                    <FormControl sx={{ mt: 2 }}>
                        <Input placeholder="Title" value={newPostData.title} onChange={handleTitle} />
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Category</FormLabel>
                        <Select value={newPostData.category} onChange={handleCategory} name="category">
                            <Option value="Announcement">Announcement</Option>
                            <Option value="Discussion">Patch Notes</Option>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Tags</FormLabel>
                        <Autocomplete placeholder="Tags" options={postTags} onChange={handleTags} multiple />
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <input type="file" onChange={handleImageUpload} />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Box>
            </Modal>
        </main>
    )
}

export default Home
