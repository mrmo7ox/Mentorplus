// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateLedger {
    // A structure to define the data for each certificate
    struct Certificate {
        uint id;
        string menteeIdentifier; // e.g., user ID or email
        string mentorIdentifier;
        string certificateDetails; // e.g., "Advanced Python Programming"
        uint256 timestamp;
    }

    // A mapping to store certificates. Think of it like a Python dictionary.
    // The key is the certificate ID (uint) and the value is the Certificate struct.
    mapping(uint => Certificate) public certificates;
    uint public certificateCount;

    // An event to announce that a new certificate has been issued
    event CertificateIssued(uint id, string mentee, string mentor);

    // A function to issue a new certificate
    // This is a "write" function, as it changes the state of the contract
    function issueCertificate(
        string memory _menteeId,
        string memory _mentorId,
        string memory _certDetails
    ) public {
        certificateCount++;
        certificates[certificateCount] = Certificate(
            certificateCount,
            _menteeId,
            _mentorId,
            _certDetails,
            block.timestamp
        );
        emit CertificateIssued(certificateCount, _menteeId, _mentorId);
    }

    // A "read" function to get the details of a specific certificate
    function getCertificate(uint _id) public view returns (string memory, string memory, string memory) {
        return (
            certificates[_id].menteeIdentifier,
            certificates[_id].mentorIdentifier,
            certificates[_id].certificateDetails
        );
    }
}