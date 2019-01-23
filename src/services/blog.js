import request from '@/utils/request';

export async function addBlogInfo(params) {
    return request('/api/BlogManager/AddBlog', {
        method: 'POST',
        body: params,
    });
}

export async function editBlogInfo(params) {
    return request('/api/BlogManager/EditBlog', {
        method: 'POST',
        body: params,
    });
}

export async function getBlogs(params) {
    return request('/api/BlogManager/GetBlogList', {
        method: 'POST',
        body: params,
    });
}