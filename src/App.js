import React, { useEffect, useState } from 'react';
import './App.css';

import { ethers } from 'ethers';
import constants from './constants.json';

import LoadContainer from './LoadContainer';
import Footer from './Footer';

function App() {
	const [currentAccount, setCurrentAccount] = useState('');
	const [chainId, setChainId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState('Loading...');

	const [amount, setAmount] = useState(0);

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	const loadMe = (isl = false, lmsg = 'Loading...') => {
		setIsLoading(isl);
		setLoadingMsg(lmsg);
	};
	// check for access to window.ethereum
	const checkIfWalletIsConnected = async () => {
		loadMe(true, 'Checking...');

		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('Make sure you have metamask!');
				loadMe();
				return;
			} else {
				console.log('1. ethereum object injected', ethereum);
			}

			// check if we are authorized to access the public address of user
			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				setCurrentAccount(account);
				console.log(
					`2. access to an account was granted`,
					currentAccount,
				);

				const chainId = await ethereum.request({
					method: 'eth_chainId',
				});

				setChainId(chainId.toString());
				ethereum.on('chainChanged', handleChainChanged);

				function handleChainChanged(_chainId) {
					// We recommend reloading the page, unless you must do otherwise
					window.location.reload();
				}

				console.log('3. checking chainId', chainId);

				if (chainId !== '0x4') {
					loadMe(true, 'Switch to rinkeby');
					alert('Please switch to rinkeby network');
					return;
				}
			} else {
				console.log('x. No accounts are accessible');
			}
		} catch (error) {
			console.log(error);
		}

		loadMe();
	};

	const connectWallet = async () => {
		loadMe(true, 'Requesting wallet');

		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get MetaMask!');
				loadMe();
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});

			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);
			console.log(`2. access to an account was granted`, currentAccount);
		} catch (error) {
			console.log(error);
		}

		loadMe();
	};

	const fundMe = async () => {
		console.log('amount:', amount);

		if (amount == undefined || amount <= 0 || amount === 'S') {
			alert('Not a valid Amount');
			return;
		}

		setIsLoading(true);
		setLoadingMsg('Getting you funds. Please Wait 🤞');

		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(
					constants.address,
					constants.ABI,
					signer,
				);

				await contract.fundMe(`${amount * 10 ** constants.decimals}`, {
					gasLimit: 300000,
				});
				alert('Transfered');
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}

		setIsLoading(false);
		setLoadingMsg('Loading...');
	};

	const onChange = async (e) => {
		await setAmount(e.target.value);
		console.log('amount:', amount);
	};

	return (
		<>
			<div className='mainContainer'>
				{isLoading ? (
					<LoadContainer
						isLoading={isLoading}
						loadingMsg={loadingMsg}
					/>
				) : (
					<div className='dataContainer'>
						<div className='header'>CCCT mint</div>
						<div className='bio'> {constants.address} </div>
						{!currentAccount && (
							<button
								className='button'
								onClick={() => {
									connectWallet();
								}}
							>
								Connect Wallet
							</button>
						)}

						{currentAccount && chainId === '0x4' && (
							<>
								<input
									type='number'
									placeholder='Enter amount'
									className='usrtxt type-1'
									onChange={(e) => {
										onChange(e);
									}}
									required
								/>
								<button
									className='button'
									onClick={() => {
										fundMe();
									}}
									disable={isLoading.toString()}
								>
									Get Tokens
								</button>
							</>
						)}
					</div>
				)}
			</div>
			<Footer />
		</>
	);
}

export default App;
