import Web3 from "web3";
import ABI from "./abi.json";
import { AbiType } from "./AbiType";

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
  return new web3.eth.Contract(ABI as AbiType, ADAPTER_ADDRESS, { from });
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
  const isAdmin = account.toLowerCase() === ownerAddress.toLowerCase();

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
  commission?: string,
  address?: string
}

export async function getDashboard(): Promise<Dashboard> {
  const contract = getContract()
  const address: string = await contract.methods.getImplementationAddress().call();
  if (/^(0x0+)$/.test(address)) {
    return { bid: Web3.utils.toWei("0.01", "ether"), commission: "10", address } as Dashboard;
  }
  const bid = `${await contract.methods.getBid().call()}`;
  const commission = `${await contract.methods.getCommission().call()}`;
  return { address, bid, commission } as Dashboard;
}

export async function upgrade(newContract: string): Promise<string> {
  const contract = getContract()
  const tx = await contract.methods.upgrade(newContract).send();
  return tx.transactionHash;
}

export async function setCommission(newCommission: number): Promise<string> {
  const contract = getContract()
  const tx = await contract.methods.setCommission(newCommission).send();
  return tx.transactionHash;
}

export async function setBid(newBid: string): Promise<string> {
  const contract = getContract()
  const tx = await contract.methods.setBid(newBid).send();
  return tx.transactionHash;
}

export type Player = {
  wallet: string,
  wins: bigint
}

export type Leaderboard = {
  players?: Player[],
  result?: string
}

export enum Options {
  NONE,
  ROCK,
  PAPER,
  SCISSORS
}

export async function play(option: Options): Promise<string> {
  const web3 = getWeb3();
  const contract = getContract(web3);
  const bid = `${await contract.methods.getBid().call()}`;
  const tx = await contract.methods.play(option).send({ value: bid });
  return tx.transactionHash;
}

export async function getResult(): Promise<string> {
  const contract = getContract();
  return contract.methods.getResult().call();
}

export async function getLeaderboard(): Promise<Leaderboard> {
  const contract = getContract();
  const players = await contract.methods.getLeaderboard().call();
  const result = await contract.methods.getResult().call();
  return { players, result } as Leaderboard
}
export async function getBestPlayers(): Promise<Leaderboard> {
  const contract = getContract();
  return contract.methods.getLeaderboard().call();
}

export async function listenEvent(callback: Function) {
  const web3 = new Web3(`${process.env.REACT_APP_WEBSOCKET_SERVER}`)
  const contract = getContract(web3);
  contract.events.Played({
    fromBlock: "latest"
  }).on("data", (event: any) => callback(event.returnValues.result))// result is the property defined in the Played smart contract event
}