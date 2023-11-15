export type PostID = string
export type SessionID = string

export type User = {
    username: string,
    name: string,
    posts: PostID[]
}

export type Post = {
    id: PostID,
    author_username: string,
    timestamp: string,
    reply_to: PostID | null,
    replies: PostID[],
    quotes: PostID[],
}

export async function req(path: string): Promise<string> {
    return (await fetch('/api' + path)).text()
}
