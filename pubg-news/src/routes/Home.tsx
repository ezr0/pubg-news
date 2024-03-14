import React from 'react'

const Home = () => {
    const userDetails = JSON.parse(localStorage.getItem('user') as string);
    console.log(userDetails);

    return (
        <main>
            <h1>HOME</h1>
        </main>
    )
}

export default Home
