// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateLedger {
    // A structure to define the data for each certificate
    struct Certificate {
        uint id;
        string studentName;
        string mentorName;
        string courseName;
        string feedback;
        uint256 timestamp;
    }

    // A mapping to store certificates. Think of it like a Python dictionary.
    // The key is the certificate ID (uint) and the value is the Certificate struct.
    mapping(uint => Certificate) public certificates;
    uint public certificateCount;

    // An event to announce that a new certificate has been issued
    event CertificateIssued(uint id, string studentName, string mentorName, string courseName);

    // A function to issue a new certificate
    // This is a "write" function, as it changes the state of the contract
    function issueCertificate(
        string memory _studentName,
        string memory _mentorName,
        string memory _courseName,
        string memory _feedback
    ) public {
        certificateCount++;
        certificates[certificateCount] = Certificate(
            certificateCount,
            _studentName,
            _mentorName,
            _courseName,
            _feedback,
            block.timestamp
        );
        emit CertificateIssued(certificateCount, _studentName, _mentorName, _courseName);
    }

    // A "read" function to get the details of a specific certificate
    function getCertificate(uint _id) public view returns (string memory, string memory, string memory, string memory) {
        return (
            certificates[_id].studentName,
            certificates[_id].mentorName,
            certificates[_id].courseName,
            certificates[_id].feedback
        );
    }
}