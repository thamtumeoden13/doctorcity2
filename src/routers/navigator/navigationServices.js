import { NavigationContainerRef, StackActions, CommonActions } from '@react-navigation/core';
import * as React from 'react';
export const navigationRef = React.createRef()
import { find, has } from 'lodash'
function navigate(routeName, params) {
  if (!navigationRef.current) return;
  navigationRef.current.navigate({
    name: routeName,
    params,
    key: routeName
  });
}

function reset(routeName, params) {
  if (!navigationRef.current) return;
  navigationRef.current.reset({
    index: 0,
    routes: [{ name: routeName, params }]
  });
}

function pop() {
  if (!navigationRef.current) return;
  navigationRef.current.goBack();
}

function replace(name, params) {
  if (!navigationRef.current) return;
  navigationRef.current.dispatch(StackActions.replace(name, params));
}

function push(name, params) {
  if (!navigationRef.current) return;
  navigationRef.current.dispatch(StackActions.push(name, params));
}

function popMultiple(number) {
  if (!navigationRef.current) return;
  navigationRef.current.dispatch(StackActions.pop(number));
}

function goBackToRouteWithName(routeName, params) {
  if (!navigationRef.current) return;
  const route = getRouteWithName(navigationRef.current.getRootState(), routeName);
  route && navigationRef.current.navigate({
    ...route,
    params
  })
}


function getRouteWithName(navigationState, name) {
  if (!navigationState) {
    return null;
  }
  const routes = navigationState.routes
  // dive into nested navigators
  if (routes) {
    // NOTE +1 is because goBack accepts from, not to!
    const index = routes.findIndex(r => r.name === name);
    if (index > -1) return routes[index];
    let state
    routes.every((route, ind) => {
      if (route.state) {
        const isHasRoute = !!find(route.state.routeNames, (v) => v == name)
        if (isHasRoute) {
          state = route.state
          return false
        }
        return true
      }
      return true
    })
    if (state) {
      return getRouteWithName(state, name);
    }
  }
}

const navigationServices = {
  reset,
  navigate,
  pop,
  push,
  popMultiple,
  replace,
  goBackToRouteWithName
}
export default navigationServices
