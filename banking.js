let web3;
let bankContract;
let userAccount;

const contractAddress = "0x0fC5025C764cE34df352757e82f7B5c4Df39A836";  
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Function to display status messages
function showStatus(message, isError = false) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');
  statusElement.classList.add(isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700');
}

// Initialize Web3 connection
window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = (await web3.eth.getAccounts())[0];
      document.getElementById('userAddress').textContent = `Connected: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
      bankContract = new web3.eth.Contract(contractABI, contractAddress);
      getBalance();
    } catch (error) {
      showStatus("Failed to connect to MetaMask. Please try again.", true);
    }
  } else {
    showStatus("Non-Ethereum browser detected. Please install MetaMask.", true);
  }
});

// Function to get balance from the smart contract
async function getBalance() {
  try {
    const balance = await bankContract.methods.getBalance().call({ from: userAccount });
    document.getElementById('balance').innerText = web3.utils.fromWei(balance, 'ether') + " ETH";
  } catch (error) {
    showStatus("Failed to fetch balance: " + error.message, true);
  }
}

// Function to deposit amount
async function deposit() {
  const amount = document.getElementById('depositAmount').value;
  if (amount <= 0) {
    showStatus("Please enter a positive amount", true);
    return;
  }
  try {
    const amountWei = web3.utils.toWei(amount, 'ether');
    await bankContract.methods.deposit(amountWei).send({ from: userAccount });
    showStatus(`Deposited ${amount} ETH successfully!`);
    getBalance();
  } catch (error) {
    showStatus("Deposit failed: " + error.message, true);
  }
}

// Function to withdraw amount
async function withdraw() {
  const amount = document.getElementById('withdrawAmount').value;
  if (amount <= 0) {
    showStatus("Please enter a positive amount", true);
    return;
  }
  try {
    const amountWei = web3.utils.toWei(amount, 'ether');
    await bankContract.methods.withdraw(amountWei).send({ from: userAccount });
    showStatus(`Withdrew ${amount} ETH successfully!`);
    getBalance();
  } catch (error) {
    showStatus("Withdrawal failed: " + error.message, true);
  }
}