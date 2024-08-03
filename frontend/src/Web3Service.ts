import Web3 from "web3";
import ABI from "./abi.json";

const ADAPTER_ADDRESS = `${process.env.REACT_APP_CONTRACT_ADDRESS}`;

type LoginResult = {
  account: string,
  isAdmin: boolean
}
function getWeb3(): Web3 {
  if (!window.ethereum) {
    throw new Error('No Metamask found!');
  }

  return new Web3(window.ethereum);
}

function getContract(web3?: Web3) {
  if (!web3) web3 = getWeb3();
  const from = localStorage.getItem("account") || undefined;
  return new web3.eth.Contract(ABI, ADAPTER_ADDRESS, { from });
}

export async function doLogin(): Promise<LoginResult> {
  const web3 = getWeb3();

  const accounts = await web3.eth.requestAccounts();

  if (!accounts || !accounts.length) {
    throw new Error('No account allowed!');
  }

  const account = accounts[0];
  const contract = getContract(web3)
  const ownerAddress: string = await contract.methods.owner().call();
  const isAdmin = account === ownerAddress;

  localStorage.setItem("account", account);
  localStorage.setItem("isAdmin", `${isAdmin}`);

  return {
    account,
    isAdmin
  } as LoginResult
}

export function doLogout() {
  localStorage.removeItem("account");
  localStorage.removeItem("isAdmin");
}

export type Dashboard = {
  bid?: string,
  commission?: number,
  address?: string
}