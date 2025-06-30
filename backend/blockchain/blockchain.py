import os
from web3 import Web3
from solcx import compile_source, install_solc , set_solc_version

install_solc('0.8.0')
set_solc_version('0.8.0')

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
w3.eth.default_account = w3.eth.accounts[0]

def compile_contract(file_path):
    with open(file_path, 'r') as f:
        source_code = f.read()
    compiled_sol = compile_source(source_code, output_values=['abi', 'bin'])
    contract_id, contract_interface = compiled_sol.popitem()
    return contract_interface['abi'], contract_interface['bin']

CONTRACT_PATH = os.path.join(os.path.dirname(__file__), "CertificateLedger.sol")
contract_abi, contract_bytecode = compile_contract(CONTRACT_PATH)
CertificateLedger = w3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)

# Deploy or load contract
def deploy_contract():
    tx_hash = CertificateLedger.constructor().transact()
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return w3.eth.contract(address=tx_receipt.contractAddress, abi=contract_abi)

deployed_ledger = deploy_contract()