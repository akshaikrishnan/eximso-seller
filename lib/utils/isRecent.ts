const isRecent = (dateStr: string): boolean => {
    const inputDate = new Date(dateStr);
    const currentDate = new Date();

    // Calculate the difference in time
    const timeDifference = currentDate.getTime() - inputDate.getTime();

    // Calculate the difference in days
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    // Check if the difference is within the past 3 days
    return dayDifference <= 3;
};

export default isRecent;
