export const validateEmail = (email) => {
    const re =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    const re =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
    return re.test(password);
};

export const getInitials = (name) => {
    if (typeof name !== 'string' || !name.trim()) return "";  // Check for valid string and non-empty string

    const nameArray = name.trim().split(" ");  // Trim any leading/trailing spaces
    let initials = '';

    nameArray.forEach((n) => {
        initials += n.charAt(0).toUpperCase();  // Ensure uppercase initials
    });

    return initials;
}
