import { queryClassificationList } from '@/services/classification';

export default {
  namespace: 'classificationmodel',
  state: {
    dataSource: [],
    editID: '',
    startUpOrProhibitID: '',
    loading: true,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100']
  },

  effects: {
    *fetchList({ parms }, { call, put }) {
      const response = yield call(queryClassificationList, parms);
      if (response && response.code === "200") {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *changeEditID({ parm }, { put }) {
      yield put({
        type: 'saveEditID',
        payload: parm,
      });
    },
    *changeStartUpOrProhibitID({ parm }, { put }) {
      yield put({
        type: 'saveStartUpOrProhibitID',
        payload: parm,
      });
    },
    *changePageInfo({ parms }, { put }) {
      yield put({
        type: 'savePageInfo',
        payload: parms,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        dataSource: action.payload.classifications,
        total: action.payload.total,
        loading: false
      };
    },
    savePageInfo(state, action) {
      return {
        ...state,
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize
      };
    },
    saveEditID(state, action) {
      return {
        ...state,
        editID: action.payload,
      };
    },
    saveStartUpOrProhibitID(state, action) {
      return {
        ...state,
        startUpOrProhibitID: action.payload,
      };
    }
  },
};
