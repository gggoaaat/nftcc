export default function ContractABI() {
	return [
        {
            "inputs": [
                {
                    "internalType": "uint8",
                    "name": "mintQty",
                    "type": "uint8"
                }
            ],
            "name": "mint1",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
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
    ]
}