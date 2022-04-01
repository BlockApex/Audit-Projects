// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

// import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../../../node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract TestERC20 is IERC20 {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    // constructor(address mintTo, uint256 amountToMintTo) {
    //     _mint(mintTo, amountToMintTo);
    // }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, 'ERC20: transfer amount exceeds allowance');
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }

        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), 'ERC20: transfer from the zero address');
        require(recipient != address(0), 'ERC20: transfer to the zero address');

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, 'ERC20: transfer amount exceeds balance');
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) public virtual {
        require(account != address(0), 'ERC20: mint to the zero address');

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), 'ERC20: burn from the zero address');

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, 'ERC20: burn amount exceeds balance');
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), 'ERC20: approve from the zero address');
        require(spender != address(0), 'ERC20: approve to the zero address');

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}

// }
//     mapping(address => uint256) public _balances;
//     mapping(address => mapping(address => uint256)) public _allowances;

//     constructor(uint256 amountToMint) {
//         mint(msg.sender, amountToMint);
//     }

//     function totalSupply() external view virtual override returns (uint256);

//     function balanceOf(address account) external view virtual override returns (uint256) {
//         return _balances[account];
//     }

//     function allowance(address owner, address spender) external view virtual override returns (uint256) {
//         return _allowances[owner][spender];
//     }

//     function transfer(address recipient, uint256 amount) external override returns (bool) {
//         uint256 balanceBefore = _balances[msg.sender];
//         require(balanceBefore >= amount, 'insufficient balance');
//         _balances[msg.sender] = balanceBefore - amount;

//         uint256 balanceRecipient = _balances[recipient];
//         require(balanceRecipient + amount >= balanceRecipient, 'recipient balance overflow');
//         _balances[recipient] = balanceRecipient + amount;

//         emit Transfer(msg.sender, recipient, amount);
//         return true;
//     }
    // function mint(address to, uint256 amount) public {
    //         uint256 balanceNext = _balances[to] + amount;
    //         require(balanceNext >= amount, 'overflow balance');
    //         _balances[to] = balanceNext;
    //     }


//     function approve(address spender, uint256 amount) external override returns (bool) {
//         _allowances[msg.sender][spender] = amount;
//         emit Approval(msg.sender, spender, amount);
//         return true;
//     }

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint256 amount
//     ) external override returns (bool) {
//         uint256 balanceRecipient = _balances[recipient];
//         require(balanceRecipient + amount >= balanceRecipient, 'overflow balance recipient');
//         _balances[recipient] = balanceRecipient + amount;
//         uint256 balanceSender = _balances[sender];
//         require(balanceSender >= amount, 'underflow balance sender');
//         _balances[sender] = balanceSender - amount;

//         emit Transfer(sender, recipient, amount);
//         return true;
//     }
