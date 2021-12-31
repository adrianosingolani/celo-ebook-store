import { useReducer, useContext, createContext, useEffect } from 'react';

import ebookstoreAbi from '../contract/ebookstore.abi.json';

const contractAddress = "0x114528DAe4E5ac802d8E820D61029927B599405F";

const StateContext = createContext();
const DispatchContext = createContext();

const initialState = {
  account: null,
  balance: null,
  kit: null,
  contract: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        kit: action.payload.kit,
        balance: action.payload.balance,
        account: action.payload.account,
      }
    case 'SET_BALANCE': 
      console.log('SET_BALANCE');
      console.log(action.payload);
      return {
        ...state,
        balance: action.payload
      }
    case 'SET_CONTRACT':
      return {
        ...state,
        contract: action.payload
      };
    case 'RESET_STATE':
      return initialState
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const ContractProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.kit) {
      const contract = new state.kit.web3.eth.Contract(ebookstoreAbi, contractAddress);

      dispatch({
        type: 'SET_CONTRACT',
        payload: contract,
      })
    }
  }, [state.kit])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const ERC20_DECIMALS = 18;

export const useContractState = () => useContext(StateContext);
export const useContractDispatch = () => useContext(DispatchContext);

export default ContractProvider;