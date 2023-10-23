interface UserSession{
    userID: string;
    username: string;
    connected: boolean;
}

class InMemorySessionStore {

    sessions: Map<string, UserSession>

    constructor() {
        this.sessions = new Map()
    }

    findSession(id: string){
        return this.sessions.get(id)
    }

    saveSession(id: string, session: UserSession){
        this.sessions.set(id, session)
    }

    findAllSession() {
        return [ ...this.sessions.values()]
    }
}

export default InMemorySessionStore;