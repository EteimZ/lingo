interface Message{
    content: string;
    from: string;
    to: string;
}

class InMemoryMessageStore {
    messages: Message[]

    constructor() {
        this.messages = [];
    }

    saveMessage(message: Message) {
        this.messages.push(message);
    }

    findMessagesForUser(from_in: string, to_in: string) {
        return this.messages.filter(
            ({ from, to }) => {
                return from === from_in && to === to_in || to === from_in && from === to_in
            }
        );
    };
}

export default InMemoryMessageStore;