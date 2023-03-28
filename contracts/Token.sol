// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20{
    function totalSupply_() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256);
    function transfer(address _to, uint256 _value) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
    function mint(address _account, uint256 amount) external ;
}

contract ERC20Token is IERC20{

    string public name;
    string public symbol;
    uint8  public decimal = 8;
    address public owner;
    mapping(address => uint256) balance;
    mapping(address => mapping(address => uint256)) _allowed;
    uint256 totalSupply;

    event Approval(address indexed owner,address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);
    
    constructor(string memory _name, string memory _symbol, uint256 _totalAmount){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalAmount;
        balance[msg.sender] = _totalAmount;
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You're not eligible for mint token!!");
        _;
    }

    function totalSupply_() public view returns (uint256){
        return totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256){
        return balance[_owner];
    }

    function approve(address spender, uint amount) external returns (bool) {
        require(spender != address(0) , "Invalid Address");
        _allowed[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function allowance(address _owner,address spender) public view  returns (uint256){
        return _allowed[_owner][spender];
    }

    function transfer(address _to, uint256 _value) public  returns (bool){
        require(_value <= balance[msg.sender], "Insufficient balance");
        require(_to != address(0),"Invalid Address");
        balance[msg.sender]-= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function mint(address account, uint256 amount) public onlyOwner(){
        require(account != address(0), "Invalid Address");
        totalSupply += amount;
        balance[account] += amount;
        emit Transfer(address(0), account, amount);
    }


    function transferFrom(address _from, address _to, uint256 _value) external  returns (bool){
    require(_value <= balance[_from], "Insufficient Balance");
    require(_to != address(0), "Invalid Address");
    require(_value <= _allowed[_from][msg.sender]);
    balance[_from] -= _value;
    balance[_to] += _value;
    _allowed[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
    return true;
    }
}