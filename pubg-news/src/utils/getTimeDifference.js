const getTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const commentTime = new Date(timestamp);
    const differenceInSeconds = Math.floor((currentTime - commentTime) / 1000);

    if (differenceInSeconds < 60) {
        return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
};

export default getTimeDifference;