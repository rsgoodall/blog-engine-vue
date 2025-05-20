export interface User {
    id: string
    name: string
    email: string
    role: string
    isVerified: boolean
    verified: string
    isEnabled: boolean
}

export interface Blog {
    id: string
    name: string
    title: string
    description: string
    images: string[]
    createdAt: string
    updatedAt: string
    isEnabled: boolean
}

export interface Post {
    id: string
    title: string
    slug: string
    content: string
    category: string
    tags: string[]
    comments: Comment[]
    createdAt: string
}

export interface Comment {
    _id: string
    user: string
    content: string
    createdAt: string
    updatedAt: string
}

export interface UserMap {
    id: string
    name: string
}