export const validateEmail = (email) => {
    const re =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
;
    return re.test(email);
};

export const validatePassword = (password) => {
    const re =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/;

;
    return re.test(password);
};

export const getInitials = (name) => {
    if(!name) return "";
    const nameArray = name.split(" ");
    let initials = '';
    nameArray.forEach((name) => {
        initials += name.charAt(0);
    });
    return initials.toUpperCase();
}
