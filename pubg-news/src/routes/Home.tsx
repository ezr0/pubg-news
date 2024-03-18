import React, { useState, useEffect } from 'react'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
// @ts-ignore
import db from '../firebase.js'
// @ts-ignore
import generateId from '../utils/generateId'

import Alert from '../components/alert/Alert'
import Autocomplete from '@mui/joy/Autocomplete'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Header from '../components/header/Header'
import Input from '@mui/joy/Input'
import Modal from '@mui/joy/Modal'
import Option from '@mui/joy/Option'
import PostCard from '../components/posts/PostCard'
import Select from '@mui/joy/Select'
import Stack from '@mui/joy/Stack'
import Textarea from '@mui/joy/Textarea'

interface AlertState {
    color: 'success' | 'warning' | 'danger' | 'neutral'
    text: string
}

const Home = () => {
    const [activeUser, setActiveUser] = useState({ permissions: '' })
    const [alert, setAlert] = useState<AlertState | null>(null)
    const [fetchDataTrigger, setFetchDataTrigger] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [newPostData, setNewPostData] = useState({ title: '', category: '', description: '', tags: '', image: '', comments: [] })
    const [openModal, setOpenModal] = useState(false)
    const [posts, setPosts] = useState<any[]>([])

    useEffect(() => {
        fetchData()
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) {
            setActiveUser({ permissions: '' })
        } else {
            setActiveUser(user)
        }
    }, [fetchDataTrigger])

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'posts'))
        const postData = querySnapshot.docs.map((doc) => doc.data())
        setPosts(postData)

        //* Sort posts by creation time
        postData.sort((a, b) => {
            return +new Date(b.created) - +new Date(a.created)
        })
        setPosts(postData)
    }

    const handleNewPost = () => {
        setOpenModal(true)
    }

    const handleTitle = (event: any) => {
        if (event && event.target) {
            setNewPostData({ ...newPostData, title: event.target.value })
        }
    }

    const handleDescription = (event: any) => {
        if (event && event.target) {
            setNewPostData({ ...newPostData, description: event.target.value })
        }
    }

    const handleTags = (event: any, newValue: any) => {
        setNewPostData({ ...newPostData, tags: newValue })
    }

    const handleCategory = (event: any) => {
        if (event && event.target) {
            setNewPostData({ ...newPostData, category: event.target.textContent })
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            setImage(file)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const id = generateId()
        let downloadURL = ''

        if (image) {
            try {
                const storage = getStorage()
                const storageRef = ref(storage, `posts/${id}}`)
                await uploadBytes(storageRef, image)
                downloadURL = await getDownloadURL(storageRef)
            } catch (error: any) {
                setAlert({ color: 'danger', text: error.message })
                return
            }
        }

        await setDoc(doc(db, 'posts', id), {
            id: id,
            title: newPostData.title,
            category: newPostData.category,
            description: newPostData.description,
            tags: newPostData.tags,
            image: downloadURL,
            comments: newPostData.comments,
            created: new Date().toUTCString(),
            updated: '',
            deleted: false,
        })
        setIsLoading(false)
        setOpenModal(false)
        setFetchDataTrigger((prev) => !prev)
    }

    const handleModalClose = () => {
        setOpenModal(false)
    }

    const postTags = [{ label: 'PC' }, { label: 'Console' }]

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
                    {posts.map((post) => (
                        <PostCard key={post.id} id={post.id} image={post.image} title={post.title} category={post.category} description={post.description} datePosted={post.created} comments={post.comments} tags={post.tags} />
                    ))}
                </Stack>
            </Stack>
            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 600 }}>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder="Title" variant="soft" value={newPostData.title} onChange={handleTitle} />
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Category</FormLabel>
                        <Select variant="soft" value={newPostData.category} onChange={handleCategory} name="category">
                            <Option value="Announcement">Announcement</Option>
                            <Option value="Discussion">Patch Notes</Option>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder="Type a post description!" minRows={4} variant="soft" value={newPostData.description} onChange={handleDescription} />
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Tags</FormLabel>
                        <Autocomplete variant="soft" placeholder="Tags" options={postTags} onChange={handleTags} multiple />
                    </FormControl>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'end' }}>
                        <label htmlFor="upload-input">
                            <Button component="span" variant="soft" color="primary">
                                Upload Image
                            </Button>
                        </label>
                        <input
                            id="upload-input"
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button color='danger' onClick={handleModalClose} loading={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} loading={isLoading}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </main>
    )
}

export default Home
