// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Bank {
    int bal;

    // Constructor to initialize the balance
    constructor() {
        bal = 1;
    }

    // Function to return the current balance
    function getBalance() public view returns (int) {
        return bal;
    }

    // Function to withdraw a specific amount from the balance
    function withdraw(int amt) public {
        require(amt <= bal, "Insufficient balance"); // Optional: Check for sufficient balance
        bal = bal - amt;
    }

    // Function to deposit a specific amount into the balance
    function deposit(int amt) public {
        bal = bal + amt;
    }
}
