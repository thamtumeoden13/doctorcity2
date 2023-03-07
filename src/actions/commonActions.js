import {
  LOADING,
  UPDATESTATUSUSER,
  UPDATEREADYPROVIDER,
  UPDATEREADYPROVIDERREF,
  TOGGLE_MODAL_UPDATE_PROFILE,
} from './actions-type';

export const loading = (data) => {
  return {type: LOADING, data};
};

export const updateStatusUser = (data) => {
  return {type: UPDATESTATUSUSER, data};
};

export const updateReadyProvider = (data) => {
  return {type: UPDATEREADYPROVIDER, data};
};

export const updateReadyProviderRef = (data) => {
  return {type: UPDATEREADYPROVIDERREF, data};
};

export const toggleShowModalProfile = (data) => {
  return {type: TOGGLE_MODAL_UPDATE_PROFILE, data};
};