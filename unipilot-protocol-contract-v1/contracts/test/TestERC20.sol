// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;


contract TestERC20 {

    /// @notice Event emitted when tokens are transferred from one address to another, either via `#transfer` or `#transferFrom`.
    /// @param from The account from which the tokens were sent, i.e. the balance decreased
    /// @param to The account to which the tokens were sent, i.e. the balance increased
    /// @param value The amount of tokens that were transferred
    event Transfer(address indexed from, address indexed to, uint256 value);

    /// @notice Event emitted when the approval amount for the spender of a given owner's tokens changes.
    /// @param owner The account that approved spending of its tokens
    /// @param spender The account for which the spending allowance was modified
    /// @param value The new allowance from the owner to the spender
    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => uint256) public   balance;
    mapping(address => mapping(address => uint256)) public   allowance;

    constructor(uint256 amountToMint) {
        mint(msg.sender, amountToMint);
    }

    function mint(address to, uint256 amount) public {
        uint256 balanceNext = balance[to] + amount;
        require(balanceNext >= amount, 'overflow balance');
        balance[to] = balanceNext;
    }

    function transfer(address recipient, uint256 amount) external   returns (bool) {
        uint256 balanceBefore = balance[msg.sender];
        require(balanceBefore >= amount, 'insufficient balance');
        balance[msg.sender] = balanceBefore - amount;

        uint256 balanceRecipient = balance[recipient];
        require(balanceRecipient + amount >= balanceRecipient, 'recipient balance overflow');
        balance[recipient] = balanceRecipient + amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external   returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external   returns (bool) {
        // uint256 allowanceBefore = allowance[sender][msg.sender];
        // require(allowanceBefore >= amount, 'allowance insufficient');

        // allowance[sender][msg.sender] = allowanceBefore - amount;

        uint256 balanceRecipient = balance[recipient];
        require(balanceRecipient + amount >= balanceRecipient, 'overflow balance recipient');
        balance[recipient] = balanceRecipient + amount;
        uint256 balanceSender = balance[sender];
        require(balanceSender >= amount, 'underflow balance sender');
        balance[sender] = balanceSender - amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balance[account];
    }
}
