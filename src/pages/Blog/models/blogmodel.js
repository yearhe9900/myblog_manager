import { getEnabledClassificationList } from '@/services/classification';
import { addBlogInfo, editBlogInfo, getBlogs, startOrStopBlog } from '@/services/blog';
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
    dataSource: [],
    enabled: true,
    searchTitle: "",
    searchStartDate: null,
    searchEndDate: null,
    searchTag: "",
    searchEnabled: null,
    reloadLoading:true
  },

  effects: {
    *changeSearchStartDate({ parms }, { put }) {
      yield put({
        type: 'saveSearchDate',
        payload: parms
      });
    },
    *changeInputTitle({ parms }, { put }) {
      yield put({
        type: 'saveSearchTitle',
        payload: parms
      });
    },
    *changeSelectTag({ parms }, { put }) {
      yield put({
        type: 'saveSearchTag',
        payload: parms
      });
    },
    *changeSelectEnabled({ parms }, { put }) {
      yield put({
        type: 'saveSearchEnabled',
        payload: parms
      });
    },
    *saveDataByBlogDetail({ parms }, { put }) {
      yield put({
        type: 'saveData',
        payload: parms
      });
    },
    *startOrStop({ parms }, { call, put, select }) {
      yield put({
        type: 'saveLoading',
        payload: true
      });
      const response = yield call(startOrStopBlog, parms);
      if (response && response.code === "200") {
        const states = yield select(state => state);
        const response2 = yield call(getBlogs, { PageNo: states.blogmodel.pageNo, PageSize: states.blogmodel.pageSize });
        if (response2 && response2.code === "200") {
          yield put({
            type: 'saveList',
            payload: response2,
          });
        }
        else if (response2 && response2.code !== "200") {
          message.error(response2.msg);
          yield put({
            type: 'saveLoading',
            payload: false
          });
        }
      }
      else if (response && response.code !== "200") {
        message.error(response.msg);
        yield put({
          type: 'saveLoading',
          payload: false
        });
      }
    },
    *fetchList({ parms }, { call, put }) {
      yield put({
        type: 'saveLoading',
        payload: true
      });
      const response = yield call(getBlogs, parms);
      if (response && response.code === "200") {
        yield put({
          type: 'saveList',
          payload: response,
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
    *editBlogThenOut({ parms }, { call, put }) {
      yield put({
        type: 'saveSubmitLoading',
        payload: true
      });
      const response = yield call(editBlogInfo, parms);
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
      yield put({
        type: 'saveReloadLoading',
        payload: true
      });
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
      yield put({
        type: 'saveReloadLoading',
        payload: false
      });
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
    saveSearchDate(state, action){
      return {
        ...state,
        searchStartDate: action.payload.searchStartDate,
        searchEndDate: action.payload.searchEndDate,
      };
    },
    saveSearchEnabled(state, action){
      return {
        ...state,
        searchEnabled: action.payload.searchEnabled,
      };
    },
    saveSearchTitle(state, action){
      return {
        ...state,
        searchTitle: action.payload.searchTitle,
      };
    },
    saveSearchTag(state, action){
      return {
        ...state,
        searchTag: action.payload.searchTag,
      };
    },
    saveReloadLoading(state, action) {
      return {
        ...state,
        reloadLoading: action.payload,
      };
    },
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
        dataSource: action.payload.output,
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
    },
    saveData(state, action) {
      return {
        ...state,
        id: action.payload.id,
        quillValue: action.payload.content,
        title: action.payload.title,
        description: action.payload.description,
        logo: action.payload.logo,
        classificationIds: action.payload.classificationIds,
        enabled: action.payload.enabled,
      };
    }
  },
};
