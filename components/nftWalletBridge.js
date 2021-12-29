import Web3 from "web3";
import Web3Modal from "web3modal";
import React, { useReducer, useState, useEffect } from 'react';
import ContractABI from "./nftccABI"
import { ethers } from "ethers";
import Button from '@mui/material/Button';
import bg_gold from '../public/bg_gold.png'
import bg_green from '../public/bg_green.png'

let provider = null;
let web3 = null;
let accounts = null;
let networkId = null;
const balance = null;
let connectedWalletAddress = null;
let contract = null;
let ethersContract = null;
const ethersProvider = null;
const etherABI = null;
let signer = null;


export default function NFTWalletBridge(e) {

    const tokenAddress = e.bridgeParams.tokenAddress;
    const providerOptions = e.bridgeParams.providerOptions;

    const [isConnected, setConnected] = useState(false);
    const [tokenBalance, setTokenBalance] = useState({ trueBalance: 'N/A', theBalance: 'N/A', connectedWalletAddress: 'N/A', filteredAddress: 'N/A' });
    const [isWaiting, setIsWaiting] = useState(false);
    const [numMinted, setnumMinted] = useState(0);
    //const initValue = { setxmPower, setConnected };

    const contractABI = ContractABI()

    async function getBalance(contractT, walletAddress) {
        const result = await contractT.balanceOf(accounts[0].toLowerCase());

        const initialBalance = ethers.utils.formatUnits(result, 9)

        return initialBalance;
    }

    async function showWeb3Modal() {
        provider = null;

        const web3Modal = new Web3Modal({
            cacheProvider: false, // optional
            providerOptions
            //disableInjectedProvider: false // required
        });

        web3Modal.clearCachedProvider()

        await launchWeb3ModalConnection(web3Modal);

        setConnected(true)

        if (!accounts) {
            accounts = await web3.eth.getAccounts();
            //accounts = await ethersProvider.listAccounts();
            networkId = await web3.eth.net.getId();
            //networkId = await ethersProvider.getNetwork()
            connectedWalletAddress = accounts[0].toLowerCase();

            contract = new web3.eth.Contract(contractABI, tokenAddress, { from: connectedWalletAddress, gas: process.env.defaultGas });
            let totalShares = await contract.methods.totalSupply.call()

            let resultTS = await totalShares.call();
            console.log(`totalShares: ${resultTS}`)
            setnumMinted(resultTS)
            
            //ethersContract = new ethers.Contract(tokenAddress, etherABI, signer)
            //const balance2 = await ethersProvider.getBalance(accounts[0]);
            const balance2 = await web3.eth.getBalance(accounts[0]);
            // balance = await getBalance(ethersContract, accounts[0]);
            // balance = Math.round(balance * 100) / 100; //Round up to 2 Decimals
            //balance = ethers.utils.formatEther(balance2)
            balance = web3.utils.fromWei(balance2, "ether")
            const filtered = connectedWalletAddress.substr(0, 6) + "..." + connectedWalletAddress.substr(connectedWalletAddress.length - 6);
            setTokenBalance({ trueBalance: balance, theBalance: balance, connectedWalletAddress: connectedWalletAddress, filteredAddress: filtered });
        }
    }

    async function disconnect() {
        // await provider.close();
        provider = null;

        const web3Modal = new Web3Modal({
            cacheProvider: true, // optional
            providerOptions
            //disableInjectedProvider: false // required
        });
        web3Modal.clearCachedProvider()
        setConnected(false)
        window.localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }

    async function launchWeb3ModalConnection(web3Modal) {

        provider = await web3Modal.connect();
        //web3 = await connect(web3Modal);
        //ethersProvider = new ethers.providers.Web3Provider(provider);

        //signer = ethersProvider.getSigner();
        //signer = provider.signer();

        if (process.env.debug) {
            console.log(ethersProvider);
            // console.log(signer);
        }

        web3 = new Web3(provider)

        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
            if (process.env.debug) {
                console.log(accounts);
            }
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
            if (process.env.debug) {
                console.log(chainId);
                console.log("connect" + " - " + error);
            }
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
            if (process.env.debug) {
                console.log(info);
                console.log("connect" + " - " + error);
            }
        });

        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {

            console.log("disconnect" + " - " + error);
            provider = null;
            setConnected(false);
            setTokenBalance({ theBalance: 'N/A', connectedWalletAddress: 'N/A' })
            disconnect()
        });

        provider.on("disconnect", (error) => {

            console.log("disconnect" + " - " + error);
            provider = null;
            setConnected(false);
            setTokenBalance({ theBalance: 'N/A', connectedWalletAddress: 'N/A' })
            disconnect()
        });
        return ethersProvider;//new Web3(provider);
    }

    function print(str) {
        const p = document.createElement("p");
        p.innerText = str;

        document.getElementById("userWalletAddress").appendChild(p);
    }

    function ShowWalletConnect(props) {
        const isLoggedIn = checkIfLoggedIN(props);
        if (isLoggedIn) {
            return (
                <Button variant="outlined" size="Large" onClick={() => disconnect()}>Disconnect Wallet</Button>
            );
        }
        return (
            <div className="showPortisBtn">
                <Button variant="outlined" size="Large" onClick={() => showWeb3Modal()}>Connect to Wallet</Button>
            </div>);
    }

    function checkIfLoggedIN(props) {
        return props == undefined ? false : true && props.isConnected == undefined ? false : props.isConnected;
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    async function sendMint(Amount) {

        if (process.env.debug) {
            console.log(Amount);
        }

        const TotalTokens = process.env.defaultGas * Amount;

        let currentGasPrice = await web3.eth.getGasPrice()
        
        if (process.env.debug) {
            console.log(`currentGasPrice: ${currentGasPrice}`)
        }      

        let gas_price = 210000;//Web3.fromWei(currentGasPrice, 'gwei') 

        if (process.env.debug) {
            console.log(`gas_price: ${gas_price}`)
        }  

        var tokens = web3.utils.toWei(TotalTokens.toString(), 'ether')
        var bntokens = web3.utils.toBN(tokens)
        contract = new web3.eth.Contract(contractABI, tokenAddress, { from: connectedWalletAddress, gas: process.env.defaultGas * Amount });


        // let txTransfer = await contract.methods.mint1(Amount).send({ from: connectedWalletAddress, value : bntokens}).then(function(result){             
        //     alert('transaction success')}).catch(function(e){ 
        //     console.log('error')                                          
        // })

        
        let txTransfer = await contract.methods.mint1(Amount).estimateGas()
        .then(function (estimate) {
          console.log("Estimated gas to execute mint: ", estimate);
        });

        //let txTransfer = await contract.methods.mint1(Amount).call();
        //let txTransfer2 = txTransfer.estimateGas({from: connectedWalletAddress});
        //console.log(txTransfer);
        return {};
    }

    return {
        web3: function () {
            return web3;
        },
        ethers: function () {
            return ethers;
        },
        // transfer: function (walletAddress, tokenAmount) {
        //     return transfer(walletAddress, tokenAmount);
        // },
        showWeb3Modal: function () {
            return showWeb3Modal();
        },
        disconnect: function (amount) {
            disconnect()
            return true;
        },
        ShowWalletConnect: function (props) {
            return ShowWalletConnect(props);
        },
        ShowSignature: function (props) {
            return ShowSignature(props);
        },
        getUseStates: function () {
            return {
                isConnected, setConnected, isWaiting, setIsWaiting,
                xmPower: tokenBalance,
                setxmPower: setTokenBalance,
                numMinted : numMinted
            }
        },
        sendMint: function (props) {
            const thisP = props;
            sendMint(props)
            return false;
        }
    };
};
