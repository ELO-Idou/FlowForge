export const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

export const isStrongPassword = (password: string) => password.length >= 8;
