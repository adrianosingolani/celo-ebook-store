import { useReducer, useContext, createContext, useEffect } from 'react';

import ebookstoreAbi from '../contract/ebookstore.abi.json';
import cUsdAbi from '../contract/erc20.abi.json';

const contractAddress = "0x0F895DF825B22F5fBC75CE1397fa7434593c8466";
const cUsdContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const StateContext = createContext();
const DispatchContext = createContext();

const initialState = {
  contractAddress: contractAddress,
  userAddress: null,
  balance: null,
  kit: null,
  contract: null,
  cUsdContract: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        kit: action.payload.kit,
        balance: action.payload.balance,
        userAddress: action.payload.userAddress,
      }
    case 'SET_BALANCE': 
      return {
        ...state,
        balance: action.payload
      }
    case 'SET_CONTRACT':
      return {
        ...state,
        contract: action.payload
      };
      case 'SET_CUSDCONTRACT':
      return {
        ...state,
        cUsdContract: action.payload
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

      const cUsdContract = new state.kit.web3.eth.Contract(cUsdAbi, cUsdContractAddress)

      dispatch({
        type: 'SET_CUSDCONTRACT',
        payload: cUsdContract,
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