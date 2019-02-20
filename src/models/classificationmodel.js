import { queryClassificationList, updateClassification, addClassification } from '@/services/classification';
import { message } from 'antd';

export default {
  namespace: 'classificationmodel',
  state: {
    dataSource: [],
    editID: '',
    loading: true,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    modelVisible: false,
    title: "编辑类别",
    isAdd: true,
    name: "",
    color: ""
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
      else if (response && response.code !== "200") {
        message.error(response.msg);
        yield put({
          type: 'saveLoading',
          payload: false
        });
      }
    },
    *update({ parms }, { select, call, put }) {
      const response = yield call(updateClassification, parms);
      if (response && response.code === "200") {
        message.success(response.msg);
        yield put({
          type: 'saveCode',
          payload: response.code,
        });
        yield put({
          type: 'modelChange',
          payload: { modelVisible: false }
        });
        yield put({
          type: 'saveLoading',
          payload: true
        });
        const states = yield select(state => state);
        const response2 = yield call(queryClassificationList, { PageNo: states.classificationmodel.pageNo, PageSize: states.classificationmodel.pageSize });
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
          type: 'modelChange',
          payload: { modelVisible: false, name: "", color: "" }
        });
      }
    },
    *add({ parms }, { select, call, put }) {
      const response = yield call(addClassification, parms);
      if (response && response.code === "200") {
        message.success(response.msg);
        yield put({
          type: 'saveCode',
          payload: response.code,
        });
        yield put({
          type: 'modelChange',
          payload: { modelVisible: false }
        });
        yield put({
          type: 'saveLoading',
          payload: true
        });
        const states = yield select(state => state);
        const response2 = yield call(queryClassificationList, { PageNo: states.classificationmodel.pageNo, PageSize: states.classificationmodel.pageSize });
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
          type: 'modelChange',
          payload: { modelVisible: false, name: "", color: "" }
        });
      }
    },
    *changeEditID({ parm }, { put }) {
      yield put({
        type: 'saveEditID',
        payload: parm,
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
    *changeModel({ parms }, { put }) {
      yield put({
        type: 'modelChange',
        payload: parms
      });
    },
    *changeInputName({ parms }, { put }) {
      yield put({
        type: 'saveInputName',
        payload: parms
      });
    },
    *changeInputColor({ parms }, { put }) {
      yield put({
        type: 'saveInputColor',
        payload: parms
      });
    }
  },

  reducers: {
    saveInputName(state, action) {
      return {
        ...state,
        name: action.payload.name,
      };
    },
    saveInputColor(state, action) {
      return {
        ...state,
        color: action.payload.color,
      };
    },
    modelChange(state, action) {
      return {
        ...state,
        modelVisible: action.payload.modelVisible,
        title: action.payload.title,
        isAdd: action.payload.isAdd,
        name: action.payload.name,
        color: action.payload.color
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
    saveCode(state, action) {
      return {
        ...state,
        responseCode: action.payload,
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
    saveEditID(state, action) {
      return {
        ...state,
        editID: action.payload,
      };
    },
    saveLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    }
  },
};
