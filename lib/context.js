// https://reactjs.org/docs/hooks-reference.html#usecontext
import { createContext } from 'react';
// const userState = {
//   default: {
//     user: null,
//     username: null,
//   },
// };
// export const UserContext = createContext(userState.default);
export const UserContext = createContext({user: null, username: null});
