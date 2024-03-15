import React, { useState, useEffect } from 'react'

import Autocomplete from '@mui/joy/Autocomplete';
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

const Home = () => {
    const [openModal, setOpenModal] = useState(false)
    const [newPostData, setNewPostData] = useState({ title: '', category: '', tag: '', image: null })

    useEffect(() => {
        //* Get post data from firestore
    }, [])


    const handleNewPost = () => {
        setOpenModal(true)
    }

    const handleModalClose = () => {
        setOpenModal(false)
    }

    const handleInputChange = (event: any) => {
        if (event && event.target) {
            const { name, value } = event.target
            setNewPostData({ ...newPostData, [name]: value })
        }
    }

    const handleImageUpload = (event: any) => {
        const file = event.target.files[0]
        setNewPostData({ ...newPostData, image: file })
    }

    const handleSubmit = () => {
        // Handle submission of new post data
        console.log(newPostData)
        setOpenModal(false)
    }

    const postTags = [
        { label: 'PC', year: 1994 },
        { label: 'Console', year: 1994 },
    ]

    return (
        <main>
            <Header />
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                <Box display="flex" justifyContent="flex-end">
                    <Button onClick={handleNewPost}>New Post</Button>
                </Box>
                <Stack spacing={2} sx={{ overflow: 'auto' }}>
                    <Post title="PUBG: BATTLEGROUNDS Weekly Bans Notice (03/04~03/10)" category="Announcement" popularPost image={require('../assets/images/weekly-bans.jpg')} datePosted="15/03/2024" comments={5} />
                    <Post title="March Store Update 2024" category="Announcement" liked image={require('../assets/images/march.jpg')} datePosted="15/03/2024" comments={10} />
                </Stack>
            </Stack>
            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400 }}>
                    <FormControl sx={{ mt: 2 }}>
                        <Input placeholder="Title" value={newPostData.title} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Category</FormLabel>
                        <Select value={newPostData.category} onChange={handleInputChange} name="category">
                            <Option value="Announcement">Announcement</Option>
                            <Option value="Discussion">Patch Notes</Option>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Tags</FormLabel>
                        <Autocomplete
                            placeholder="Tags"
                            options={postTags}
                            onChange={handleInputChange}
                            multiple
                        />
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
