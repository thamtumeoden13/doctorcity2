import {
  LOADING,
  TOGGLE_MODAL_UPDATE_PROFILE,
  UPDATEREADYPROVIDER,
  UPDATEREADYPROVIDERREF,
  UPDATESTATUSUSER,
} from '../actions/actions-type';

const initState = {
  loading: false,
  statususer: 'customer',
  readyProvider: null,
  readyProviderRef: null,
  showUserProfile: {
    isShow: false,
    isNewUser: false
  }
};

export default commonReducer = (state = initState, action) => {
  const {type, data} = action;
  switch (type) {
    case LOADING: {
      return Object.assign({}, state, {
        loading: data,
      });
    }
    case UPDATESTATUSUSER: {
      return Object.assign({}, state, {
        statususer: data,
      });
    }
    case UPDATEREADYPROVIDER: {
      return Object.assign({}, state, {
        readyProvider: data,
      });
    }
    case UPDATEREADYPROVIDERREF: {
      return Object.assign({}, state, {
        readyProviderRef: data,
      });
    }
    case TOGGLE_MODAL_UPDATE_PROFILE: {
      return Object.assign({}, state, {
        showUserProfile: data,
      });
    }
    default: {
      return state;
    }
  }
};
