import json
from web3 import Web3
from solcx import compile_source, install_solc

# --- 1. SETUP ---
# Make sure solc is installed
install_solc('0.8.0')

# Connect to your local Ganache blockchain
ganache_url = "http://127.0.0.1:7545" # Default URL for Ganache GUI
w3 = Web3(Web3.HTTPProvider(ganache_url))

# Check if the connection is successful
if not w3.is_connected():
    print("Error: Could not connect to Ganache.")
    exit()

print("Successfully connected to Ganache.")

# Set a default account to send transactions from
# This is the first account provided by Ganache
w3.eth.default_account = w3.eth.accounts[0]



def compile_contract(file_path):
    with open(file_path, 'r') as f:
        source_code = f.read()

    compiled_sol = compile_source(
        source_code,
        output_values=['abi', 'bin'] # bin is the bytecode
    )

    # Get the contract interface
    contract_id, contract_interface = compiled_sol.popitem()
    return contract_interface['abi'], contract_interface['bin']

print("Compiling contract...")
contract_abi, contract_bytecode = compile_contract('CertificateLedger.sol')
print("Contract compiled.")

# --- 3. DEPLOY THE CONTRACT ---
print("Deploying contract...")
CertificateLedger = w3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)

# Submit the transaction that deploys the contract
tx_hash = CertificateLedger.constructor().transact()

# Wait for the transaction to be mined, and get the transaction receipt
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

# Get the deployed contract address
contract_address = tx_receipt.contractAddress
print(f"Contract deployed at address: {contract_address}")



# --- 4. INTERACT WITH THE CONTRACT ---

# Get the contract instance
deployed_ledger = w3.eth.contract(address=contract_address, abi=contract_abi)

# A) Call the 'issueCertificate' function (Write Operation)
print("\nIssuing a new certificate...")
tx_hash_issue = deployed_ledger.functions.issueCertificate(
    'mentee@example.com',
    'mentor@example.com',
    'Certified Blockchain Developer'
).transact()
w3.eth.wait_for_transaction_receipt(tx_hash_issue)
print("Certificate issued successfully! Transaction hash:", tx_hash_issue.hex())

# B) Call the 'getCertificate' function (Read Operation)
print("\nReading certificate details from the blockchain...")
# The certificate ID is 1 because we just issued the first one
certificate_data = deployed_ledger.functions.getCertificate(1).call() 
print("Retrieved Certificate #1:")
print(f"  Mentee: {certificate_data[0]}")
print(f"  Mentor: {certificate_data[1]}")
print(f"  Details: {certificate_data[2]}")

# C) You can also read public state variables directly
print("\nReading public variables...")
count = deployed_ledger.functions.certificateCount().call()
print(f"Total certificates issued: {count}")