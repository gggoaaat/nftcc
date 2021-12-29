import WalletConnectProvider from "@walletconnect/web3-provider";
import NFTWalletBridge from '../nftWalletBridge';
import Button from '@mui/material/Button';
import { style } from "@mui/system";
import React, { useReducer, useState, useEffect } from 'react';
import Image from 'next/image'


export default function MintInit() {

    let lastUp;

    const bridgeParams = {
        tokenAddress: process.env.contractAddress,
        providerOptions: {
            metamask: {
                id: 'injected',
                name: 'MetaMask',
                type: 'injected',
                check: 'isMetaMask'
            },
            walletconnect: {
                package: WalletConnectProvider, // required
                options: {
                    // rpc: {
                    //     1: 'https://mainnet.infura.io/v3/b830c8484bf841d795848610ff791d5b'
                    // },
                    network: 'mainnet',
                    chainId: 1,
                    infuraId: "b830c8484bf841d795848610ff791d5b", // required
                    address: process.env.contractAddress,
                    qrcodeModalOptions: {
                        mobileLinks: [
                            'rainbow',
                            'metamask',
                            'argent',
                            'trust',
                            'imtoken',
                            'pillar'
                        ]
                    }
                }
            }
        }
    };

    let dappParams = { bridgeParams: bridgeParams }
    let walletBridge1 = NFTWalletBridge(dappParams);

    let currentUseState = walletBridge1.getUseStates();

    walletBridge1.get

    const SliderStyle = {
        //width: "100%",
        float: "left",
        padding: "1px",
        //padding: "0rem 2rem 0rem 0rem"    
    }

    const walletStyle = {
        width: "100%",
        float: "left",
        //padding: "0rem 2rem 0rem 2rem"    
    }

    const dappBody = {
        padding: "0rem 1rem 0rem 1rem"
    }

    function onChangeSlider(props) {
        var val = $(this).val();
        $(this).siblings('.testInput').val(val);
    }

    function Question(props) {
        const thisQuestion = 'Should xMooney join forces with former Safemoon CTO Thomas "Papa" Smith?';
        return thisQuestion;
    }

    function doCORSRequest(url) {
        if (process.env.debug == true) {
            return 'http://localhost.com:8080/' + url
        }

        return url;
    }

    function loadup(returnedhash) {

        lastUp.evmHash = returnedhash;
        if (returnedhash) {
            fetch(doCORSRequest('https://us-east1-just-shape-317505.cloudfunctions.net/postcontent'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lastUp)
            })
        }
    }

    async function SendMint(props) {

        lastUp = ({
            vote: props.vote,
            amount: currentUseState.xmPower.theBalance,
            trueAmount: currentUseState.xmPower.trueBalance,
            address: currentUseState.xmPower.connectedWalletAddress,
            timestamp: +new Date()
        });

        const returnedhash = await walletBridge1.sendMint(props.mint)

        //let retu = await loadup(returnedhash)
        if (process.env.debug) {
            console.log(returnedhash)
        }
    }

    const [formInput, updateFormInput] = useState({
        price: "",
        amount: "1",
    });

    return (
        <>
            <walletBridge1.ShowWalletConnect isConnected={currentUseState.isConnected} />
            {(currentUseState.isConnected && currentUseState.isWaiting == true) &&
                <div>
                    <Image src="https://static.wixstatic.com/media/0d6414_a2b5156ac336444e8dc78d9efb799904~mv2.gif" width="200px" height="200px" alt="Loading" />
                </div>
            }
            <div id="userWalletAddress" style={dappBody}>
                <p>
                    Wallet address: <strong>{currentUseState.xmPower.filteredAddress}</strong>
                    <br />
                    Eth Balance : <strong>{currentUseState.xmPower.theBalance}</strong>
                </p>
            </div>

            {(currentUseState.isConnected && currentUseState.isWaiting == false) &&
                <div style={dappBody}>
                    <label>Number to mint (1-200):</label>

                    <input type="number" id="mints" name="mints" min="1" max="200" defaultValue="1" onChange={(e) =>
                        updateFormInput({ ...formInput, amount: e.target.value })
                    } />
                </div>
            }

            {(currentUseState.isConnected && currentUseState.isWaiting == false) &&
                <div style={dappBody}>
                    {(currentUseState.isConnected && currentUseState.isWaiting == false && currentUseState.xmPower.filteredAddress != "N/A") &&
                        <div style={SliderStyle}>
                            <Button variant="outlined" size="Large" onClick={() => SendMint({ mint: formInput.amount })}>Mint</Button>
                        </div>}
                </div>
            }
            <br/>
            {(currentUseState.isConnected && currentUseState.isWaiting == false) &&
                <div style={dappBody}>
                    NFTCC&apos;s minted {currentUseState.numMinted} of 2500
                </div>
            }
        </>
    )
}