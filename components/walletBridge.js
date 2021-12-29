import Web3 from "web3";
import Web3Modal from "web3modal";
import React, { useReducer, useState, useEffect } from 'react';
import ContractABI from "../components/contractAbi"
import { ethers } from "ethers";
import Button from '@mui/material/Button';

let provider = null;
let web3 = null;
let accounts = null;
let networkId = null;
let balance = null;
let connectedWalletAddress = null;
let contract = null;
let ethersContract = null;
const ethersProvider = null;
const etherABI = null;
let signer = null;


export default function WalletBridge(e) {

    const tokenAddress = e.bridgeParams.tokenAddress;
    const providerOptions = e.bridgeParams.providerOptions;

    const [isConnected, setConnected] = useState(false);
    const [tokenBalance, setTokenBalance] = useState({ trueBalance: 'N/A', theBalance: 'N/A', connectedWalletAddress: 'N/A', filteredAddress: 'N/A' });
    const [isWaiting, setIsWaiting] = useState(false);
    //const initValue = { setxmPower, setConnected };


    const minABI = ContractABI();
    const etherABI = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function transfer(address recipient, uint256 amount) public override returns (bool)",
        "function balanceOf(address account) external view returns (uint256)"
        //"function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external"
    ];

    async function getBalance(contractT, walletAddress) {
        const result = await contractT.balanceOf(accounts[0].toLowerCase());

        const initialBalance = ethers.utils.formatUnits(result, 9)

        //getCurrentBlock()
        //getWalletAddress()
        //const result = await contractT.methods.balanceOf(walletAddress).call(); // 29803630997051883414242659
        //const initialBalance = web3.utils.fromWei(result, 'gwei'); // 29803630.997051883414242659
        //console.log(initialBalance);
        return initialBalance;
    }

    async function getCurrentBlock() {
        let currentBlock = await ethersProvider.getBlockNumber();
        console.log("currentBlock: " + currentBlock);
    }

    async function getWalletAddress() {
        let thisAddress = await signer.getAddress();
        console.log("Address: " + thisAddress);
    }

    // function send_token(
    //     contract_address,
    //     send_token_amount,
    //     to_address,
    //     send_account
    // ) {
    //     //let wallet = new ethers.Wallet(private_key)
    //     let walletSigner = signer;
    //     let gas_limit = 100000;

    //     ethersProvider.getGasPrice().then((currentGasPrice) => {
    //         let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
    //         console.log(`gas_price: ${gas_price}`)

    //         if (contract_address) {
    //             // general token send
    //             let contract = new ethers.Contract(
    //                 contract_address,
    //                 etherABI,
    //                 walletSigner
    //             )

    //             // How many tokens?
    //             let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 9)
    //             console.log(`numberOfTokens: ${numberOfTokens}`)

    //             // Send tokens
    //             contract.transfer(to_address, numberOfTokens, {
    //                 gasLimit: ethers.utils.hexlify(gas_limit), // 100000
    //                 gasPrice: gas_price,
    //             }).then((transferResult) => {
    //                 console.dir(transferResult)
    //                 alert("sent token")
    //             })
    //         } // ether send
    //         else {
    //             const tx = {
    //                 from: send_account,
    //                 to: to_address,
    //                 value: ethers.utils.parseEther(send_token_amount),
    //                 nonce: window.ethersProvider.getTransactionCount(
    //                     send_account,
    //                     "latest"
    //                 ),
    //                 gasLimit: ethers.utils.hexlify(gas_limit), // 100000
    //                 gasPrice: gas_price,
    //             }
    //             console.dir(tx)
    //             try {
    //                 walletSigner.sendTransaction(tx).then((transaction) => {
    //                     console.dir(transaction)
    //                     alert("Send finished!")
    //                 })
    //             } catch (error) {
    //                 alert("failed to send!!")
    //             }
    //         }
    //     })
    // }

    async function transfer(SendtoWalletAddress, Amount) {

        let TokenOwner = connectedWalletAddress;
        let contractAddress = contract;
        let amount = Math.round(Amount * 100) / 100; //Round up to 2 Decimals

        let count = 0;

        const xMooney = ethers.utils.parseUnits(String(amount), 9);
        if (process.env.debug) {
            console.log(Amount);
            console.log(xMooney);
        }
        //var numberOfDecimals = 9;
        //var numberOfTokens = ethers.utils.parseUnits(String(xMooney), numberOfDecimals);

        let txTransfer = await ethersContract.transfer(SendtoWalletAddress, xMooney);

        let transactionData = {
            from: connectedWalletAddress,
            to: process.env.contractAddress,
            data: txTransfer,
            gasPrice: ethers.utils.hexlify(6000000000),
            gasLimit: ethers.utils.hexlify(500000),

        }
        if (process.env.debug) {
            console.log("Start Transactions");
        }
        let thisReq = await provider.sendTransaction(transactionData);

        const receipt = await thisReq.wait();
        if (process.env.debug) {
            console.log(receipt);
        }
        return {};
    }

    async function showWeb3Modal() {
        provider = null;

        const web3Modal = new Web3Modal({
            cacheProvider: true, // optional
            providerOptions
            //disableInjectedProvider: false // required
        });

        web3Modal.clearCachedProvider()

        await launchWeb3ModalConnection(web3Modal);

        setConnected(true)

        if (!accounts) {
            //accounts = await web3.eth.getAccounts();
            accounts = await ethersProvider.listAccounts();
            //networkId = await web3.eth.net.getId();
            networkId = await ethersProvider.getNetwork()
            connectedWalletAddress = accounts[0].toLowerCase();

            //contract = new web3.eth.Contract(minABI, tokenAddress, { from: theWallet, gas: 100000 });
            ethersContract = new ethers.Contract(tokenAddress, etherABI, signer)
            balance = await getBalance(ethersContract, accounts[0]);
            balance = Math.round(balance * 100) / 100; //Round up to 2 Decimals

            const filtered = connectedWalletAddress.substr(0, 6) + "..." + connectedWalletAddress.substr(connectedWalletAddress.length - 6);
            setTokenBalance({ trueBalance: balance, theBalance: numberWithCommas(balance), connectedWalletAddress: connectedWalletAddress, filteredAddress: filtered });
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

        ethersProvider = new ethers.providers.Web3Provider(provider);
        signer = ethersProvider.getSigner();
        if (process.env.debug) {
            console.log(ethersProvider);
            console.log(signer);
        }

        //web3 = new Web3(provider)

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
        return ethersProvider;//new Web3(provider);
    }

    function print(str) {
        const p = document.createElement("p");
        p.innerText = str;

        document.getElementById("userWalletAddress").appendChild(p);
    }

    async function signMessage(props, thisFunc) {

        setIsWaiting(true)
        let message = props.message ? props.message : "Sign this please";

        console.log("version :", ethers.version);

        function signMessageCatch(error, result) {
            if (process.env.debug) {
                console.log("Catch User Response")
                console.log(error);
                console.log(result);
            }
        }

        let messageHash = ethers.utils.id("Hello World");
        let messageHashBytes = ethers.utils.arrayify(messageHash)

        function signMessageSuccess(e) {
            if (thisFunc) {
                thisFunc(e)
            }
        }

        let tempMessage = await ethersContract.signer.signMessage(message).then(signMessageSuccess).catch(signMessageCatch)

        //let tempMessage = await web3.eth.sign(web3.utils.utf8ToHex(message), theWallet, eeee)
        if (process.env.debug) {
            console.log("The Message")
        }

        setIsWaiting(false)
        return tempMessage;
        //let signature = web3.eth.accounts.sign(message, '0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7');
        /*
        
        , function (whatHappened) {
              console.log(whatHappened)
              if (false) {
                console.log("signature :", signature);
        
                let messageHash = web3.eth.accounts.hashMessage(message);
                //recover 1
                let recover_1 = web3.eth.accounts.recover({
                  messageHash: messageHash,
                  v: signature.v,
                  r: signature.r,
                  s: signature.s
                });
        
                console.log("recover 1 :", recover_1);
        
        
                // message, signature
                let recover_2 = web3.eth.accounts.recover(message, signature.signature);
                console.log("recover 2 :", recover_2);
        
                // message, v, r, s
                let recover_3 = web3.eth.accounts.recover(message, signature.v, signature.r, signature.s);
                console.log("recover 3 :", recover_3);
              }
            }*/

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

    function ShowSignature(props) {
        const isLoggedIn = checkIfLoggedIN(props);
        if (isLoggedIn) {
            return (
                <div className="showPortisBtn">
                    <button type="primary" onClick={() => signMessage()} >
                        Sign Message
                    </button>
                </div>);
        }
        return ('');
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return {
        abi: function () {
            return minABI;
        },
        web3: function () {
            return web3;
        },
        ethers: function () {
            return ethers;
        },
        transfer: function (walletAddress, tokenAmount) {
            return transfer(walletAddress, tokenAmount);
        },
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
                setxmPower: setTokenBalance
            }
        },
        signMessage: function (props, thisFunc) {
            return signMessage(props, thisFunc);
        }
    };
};