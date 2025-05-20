import { apiClient } from './Common';

export default {
    getBlog(blogName: string) {
        return apiClient.get(`/blogs/name/${blogName}`);
    },
    getBlogs() {
        return apiClient.get('/blogs');
    },
    getPosts(blogId: string) {
        return apiClient.get(`/blogs/${blogId}/posts`);
    },
    searchBlogs(payload: any) {
        return apiClient.post('/blogs/search', payload);
    },
    getMyBlogs() {
        return apiClient.get('/blogs/getMyBlogs', { withCredentials: true});
    },
    createBlog(payload: any) {
        console.log("createBlog: ",payload);
        return apiClient.post('/blogs', payload, { withCredentials: true}); 
    },
    deleteBlog(blogId: string) {
        return apiClient.delete(`/blogs/${blogId}`, { withCredentials: true});
    },
    updateBlog(blogId: string, payload: any) {
        return apiClient.patch(`/blogs/${blogId}`, payload, { withCredentials: true});
    },
    createPost(blogId: string, payload: any) {
        return apiClient.post(`/blogs/${blogId}/posts`, payload, { withCredentials: true});
    },
    deletePost(blogId: string, postId: string) {
        return apiClient.delete(`/blogs/${blogId}/posts/${postId}`, { withCredentials: true});
    },
    updatePost(blogId: string, postId: string, payload: any) {
        return apiClient.patch(`/blogs/${blogId}/posts/${postId}`, payload, {withCredentials: true});
    },
    uploadPostImage(blogId: string, form: any) {
        return apiClient.post(`/blogs/${blogId}/posts/uploadImage`, form, { headers: { 'Content-Type': 'multipart/form-data'}, withCredentials: true});
    },
    createComment(blogId: string, postId: string, payload: any) {
        return apiClient.post(`/blogs/${blogId}/posts/${postId}/comments`, payload, { withCredentials: true});
    },
    updateComment(blogId: string, postId: string, commentId: string, payload: any) {
        return apiClient.patch(`/blogs/${blogId}/posts/${postId}/comments/${commentId}`, payload, {withCredentials: true});
    },
    deleteComment(blogId: string, postId: string, commentId: string) {
        return apiClient.delete(`/blogs/${blogId}/posts/${postId}/comments/${commentId}`, {withCredentials: true});
    }
};