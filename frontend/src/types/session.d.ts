interface ISession {
    id: string,
    token: string,
        ip_address: string,
        user_agent: string,
        expire_at: string,
        created_at: string,
        user_id: string
}

interface ISessionResponse {
    session: ISession[],
    message: string
}