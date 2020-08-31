
const appReducer = (state = {
  data: [],
  columns: [],
  color: [],
  breed: [],
  Jsondata: [],
  viewdata: [],
  Review: [],
  FileData: [],
  LandingData: [],
  ViewData: [],
  view: []
}, action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'setdata':
      return Object.assign({}, state, { data: action.text })
    case 'setcoldata':
      return Object.assign({}, state, { columns: action.text })
    case 'setcolordata':
      return Object.assign({}, state, { color: action.text })
    case 'setbreeddata':
      return Object.assign({}, state, { breed: action.text })
    case 'setjsonata':
      return Object.assign({}, state, { Jsondata: action.text })
    case 'setviewata':
      return Object.assign({}, state, { viewdata: action.text })
    case 'setreviewata':
      return Object.assign({}, state, { Review: action.text })
    case 'setfiledata':
      return Object.assign({}, state, { FileData: action.text })
    case 'setlandingdata':
      return Object.assign({}, state, { LandingData: action.text })
    case 'setviewJSONData':
      return Object.assign({}, state, { ViewData: action.text })
    case 'setviewdata':
      return Object.assign({}, state, { view: action.text })
    default:
      return state;
  };
}
export default appReducer;