export default {
  namespace: 'blogmodel',
  state: {
    quillValue:'',
    fileList:[],
    
  },

  effects: {
    *handleChange({ parm }, {  put }) {
      yield put({
        type: 'changeHandle',
        payload: parm,
      });
    },
    *fileListChange({ parm }, {  put }) {
      yield put({
        type: 'changeFileList',
        payload: parm,
      });
    },
  },

  reducers: {
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
  },
};
