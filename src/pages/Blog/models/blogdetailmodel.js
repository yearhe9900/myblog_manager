import { getBlogDetailById, startOrStopBlog } from '@/services/blog';
import { message } from 'antd';

export default {
    namespace: 'blogdetailmodel',
    state: {
        commendation: 0,
        content: '',
        description: '',
        id: '',
        tags: [],
        title: '',
        cdt: '',
        enabled: false,
        dividerDashed: true,
        loading: true,
        classificationIds: [],
    },

    effects: {
        *startOrStopDetail({ parms }, { call, put }) {
            yield put({
                type: 'saveLoading',
                payload: true
            });
            const response = yield call(startOrStopBlog, parms);
            if (response && response.code === "200") {
                const response2 = yield call(getBlogDetailById, parms);
                if (response2 && response2.code === "200") {
                    yield put({
                        type: 'saveBlogDetail',
                        payload: response2.data,
                    });
                }
                else if (response2 && response2.code !== "200") {
                    message.error(response2.msg);
                }
            }
            else if (response && response.code !== "200") {
                message.error(response.msg);
            }
            yield put({
                type: 'saveLoading',
                payload: false
            });
        },
        *getBlogById({ parms }, { call, put }) {
            yield put({
                type: 'saveLoading',
                payload: true
            });
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
            yield put({
                type: 'saveLoading',
                payload: false
            });
        },
    },

    reducers: {
        saveLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        saveBlogDetail(state, action) {
            return {
                ...state,
                commendation: action.payload.commendation,
                content: action.payload.content,
                description: action.payload.description,
                id: action.payload.id,
                tags: action.payload.tags,
                title: action.payload.title,
                cdt: action.payload.cdt,
                enabled: action.payload.enabled,
                classificationIds: action.payload.classificationIds,
            };
        },
    },
};
