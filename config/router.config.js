export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // blog
      {
        path: '/blog',
        icon: 'form',
        name: 'blog',
        routes: [
          {
            path: '/blog/add-blog',
            name: 'addblog',
            component: './Blog/AddBlog',
          },
          {
            path: '/blog/blog-list',
            name: 'bloglist',
            component: './Blog/BlogList',
          },
          {
            path: '/blog/blog-detail',
            name: 'blogdetail',
            component: './Blog/BlogDetail',
            hideInMenu: true,
          }
        ],
      },
      // classification
      {
        path: '/classification',
        icon: 'form',
        name: 'classification',
        routes: [
          {
            path: '/classification/management',
            name: 'management',
            component: './Classification/ClassificationList',
          }
        ],
      },
 
      {
        component: '404',
      },
    ],
  },
];
