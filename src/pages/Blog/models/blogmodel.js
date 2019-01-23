import { getEnabledClassificationList } from '@/services/classification';
import { addBlogInfo, editBlogInfo, getBlogs } from '@/services/blog';
import { message } from 'antd';

export default {
  namespace: 'blogmodel',
  state: {
    quillValue: '',
    fileList: [],
    classificationList: [],
    title: '',
    description: '',
    logo: '',
    classificationIds: [],
    id: '',
    submitLoading: false,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    loading: true,
    dataSource: []
  },

  effects: {
    *fetchList({ parms }, { call, put }) {
      const response = yield call(getBlogs, parms);
      if (response && response.code === "200") {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
      else if (response && response.code !== "200") {
        message.error(response.msg);
        yield put({
          type: 'saveLoading',
          payload: false
        });
      }
    },
    *handleChange({ parm }, { put }) {
      yield put({
        type: 'changeHandle',
        payload: parm,
      });
    },
    *fileListChange({ parm }, { put }) {
      yield put({
        type: 'changeFileList',
        payload: parm,
      });
    },
    *changeTitle({ parm }, { put }) {
      yield put({
        type: 'saveTitle',
        payload: parm,
      });
    },
    *changeDescription({ parm }, { put }) {
      yield put({
        type: 'saveDescription',
        payload: parm,
      });
    },
    *changeLogo({ parm }, { put }) {
      yield put({
        type: 'saveLogo',
        payload: parm,
      });
    },
    *changeClassificationIds({ parm }, { put }) {
      yield put({
        type: 'saveClassificationIds',
        payload: parm,
      });
    },
    *addBlog({ parms }, { call, put }) {
      yield put({
        type: 'saveSubmitLoading',
        payload: true
      });
      const response = yield call(addBlogInfo, parms);
      if (response && response.code === "200") {
        message.success(response.msg);
        yield put({
          type: 'saveId',
          payload: response.id
        });
      }
      else if (response && response.code !== "200") {
        message.error(response.msg);
      }
      yield put({
        type: 'saveSubmitLoading',
        payload: false
      });
    },
    *editBlog({ parms }, { call, put }) {
      yield put({
        type: 'saveSubmitLoading',
        payload: true
      });
      const response = yield call(editBlogInfo, parms);
      if (response && response.code === "200") {
        message.success(response.msg);
      }
      else if (response && response.code !== "200") {
        message.error(response.msg);
      }
      yield put({
        type: 'saveSubmitLoading',
        payload: false
      });
    },
    *addBlogThenOut({ parms }, { call, put }) {
      yield put({
        type: 'saveSubmitLoading',
        payload: true
      });
      const response = yield call(addBlogInfo, parms);
      if (response && response.code === "200") {
        message.success(response.msg);
        yield put({
          type: 'initializeData',
        });
      }
      else if (response && response.code !== "200") {
        message.error(response.msg);
      }
      yield put({
        type: 'saveSubmitLoading',
        payload: false
      });
    },
    *getClassificationList(_, { call, put }) {
      const response = yield call(getEnabledClassificationList);
      if (response && response.code === "200") {
        yield put({
          type: 'saveClassificationList',
          payload: response.classifications
        });
      }
      else if (response && response.code !== "200") {
        message.error(response.msg);
      }
    },
    *changePageInfo({ parms }, { put }) {
      yield put({
        type: 'savePageInfo',
        payload: parms,
      });
    },
    *changeLoading({ parm }, { put }) {
      yield put({
        type: 'saveLoading',
        payload: parm
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
    savePageInfo(state, action) {
      return {
        ...state,
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        loading: true
      };
    },
    saveList(state, action) {
      return {
        ...state,
        dataSource: action.payload.classifications,
        total: action.payload.total,
        loading: false
      };
    },
    saveSubmitLoading(state, action) {
      return {
        ...state,
        submitLoading: action.payload,
      };
    },
    saveId(state, action) {
      return {
        ...state,
        id: action.payload,
      };
    },
    saveClassificationIds(state, action) {
      return {
        ...state,
        classificationIds: action.payload,
      };
    },
    saveLogo(state, action) {
      return {
        ...state,
        logo: action.payload,
      };
    },
    saveDescription(state, action) {
      return {
        ...state,
        description: action.payload,
      };
    },
    saveTitle(state, action) {
      return {
        ...state,
        title: action.payload,
      };
    },
    saveClassificationList(state, action) {
      return {
        ...state,
        classificationList: action.payload,
      };
    },
    changeHandle(state, action) {
      return {
        ...state,
        quillValue: action.payload,
      };
    },
    changeFileList(state, action) {
      return {
        ...state,
        fileList: action.payload,
      };
    },
    initializeData(state) {
      return {
        ...state,
        quillValue: '',
        fileList: [],
        title: '',
        description: '',
        logo: '',
        classificationIds: []
      };
    }
  },
};
