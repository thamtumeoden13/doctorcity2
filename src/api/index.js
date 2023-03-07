import * as chotdonAPI from './product';
import * as auth from './auth';
import * as firebase from './firebase';

export default api = {
  ...chotdonAPI,
  ...auth,
  ...firebase
};