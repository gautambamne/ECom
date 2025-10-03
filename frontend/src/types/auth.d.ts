   interface IUser {
        id: string,
        name: string,
        email: string,
        role: string,
        isVerified: boolean
    }//for IRegistration and IVerify

    interface ILoginResposne {
        user: IUser,
        accessToken: string,
        refreshToken: string
    }

    interface IRefreshResponse{
        accessToken:string
    }