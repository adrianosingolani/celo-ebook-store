import { useReducer, useContext, createContext, useEffect } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StateContext = createContext();
const DispatchContext = createContext();

const initialState = {
  open: false,
  message: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        open: true,
        message: action.payload,
      }
    case 'RESET_NOTIFICATION':
      return initialState
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function Notification({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={state.open}
          autoHideDuration={6000}
          onClose={() => {
            dispatch({
              type: 'RESET_NOTIFICATION',
            })
          }}
          message={state.message}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch({
                  type: 'RESET_NOTIFICATION',
                })
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        />
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useNotificationState = () => useContext(StateContext);
export const useNotificationDispatch = () => useContext(DispatchContext);