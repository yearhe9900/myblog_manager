import { getBlogDetailById } from '@/services/blog';
import { message } from 'antd';

export default {
    namespace: 'blogdetailmodel',
    state: {
        commendation: 0,
        content: '',
        description: '',
        id: '',
        logo: '',
        tags: [],
        title: '',
        cdt: ''
    },

    effects: {
        *getBlogById({ parms }, { call, put }) {
            const response = yield call(getBlogDetailById, parms);
            if (response && response.code === "200") {
                yield put({
                    type: 'saveBlogDetail',
                    payload: response.data,
                });
            }
            else if (response && response.code !== "200") {
                message.error(response.msg);
            }
        },
    },

    reducers: {
        saveBlogDetail(state, action) {
            return {
                ...state,
                commendation: action.payload.commendation,
                content: action.payload.content,
                description: action.payload.description,
                id: action.payload.id,
                logo: action.payload.logo,
                tags: action.payload.tags,
                title: action.payload.title,
                cdt: action.payload.cdt
            };
        },
    },
};
