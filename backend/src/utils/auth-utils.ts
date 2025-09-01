import bcrypt from 'bcrypt';

const passwordUtils = {
    generatedHashPassword: (password: string)=>{
        return bcrypt.hashSync('password', 10);
    },
    comparredPassword: (originalPassword: string, hashedPassword: string)=>{
        return bcrypt.compareSync(originalPassword, hashedPassword);
    }
}

const verificationUtils = ()=>{
    return String(Math.floor(100000 + Math.random() * 900000));
}

export {passwordUtils, verificationUtils};