pragma solidity ^0.4.24;

import "../zeppelin-solidity/token/ERC20/ERC20.sol";
import "../zeppelin-solidity/ownership/Ownable.sol";
import "../zeppelin-solidity/math/SafeMath.sol";

interface DisbursementHandlerI {
  function withdraw(address _beneficiary) external;
  function calcMaxWithdraw(address _beneficiary) external view returns (uint256);
}

/// @title Disbursement handler - Manages time locked disbursements of ERC20 tokens
contract DisbursementHandler is DisbursementHandlerI, Ownable {
  using SafeMath for uint256;

  struct Disbursement {
    // Tokens cannot be withdrawn before this timestamp
    uint256 timestamp;

    // Amount of tokens to be disbursed
    uint256 tokens;
  }

  event Setup(address indexed _vestor, uint256 _timestamp, uint256 _tokens);
  event Withdraw(address indexed _to, uint256 _value);
  event Cancel(address indexed _to, uint256 _value);

  ERC20 public token;
  uint256 public totalAmount;
  mapping(address => Disbursement[]) public disbursements;
  mapping(address => uint256) public withdrawnTokens;
  mapping(address => Disbursement[]) public cancelledDisbursements;
  mapping(address => uint256) public cancelledTokens;

  constructor(address _token) public {
    token = ERC20(_token);
  }

  /// @dev Called by the sale contract to create a disbursement.
  /// @param _vestor The address of the beneficiary.
  /// @param _tokens Amount of tokens to be locked.
  /// @param _timestamp Funds will be locked until this timestamp.
  function setupDisbursement(
    address _vestor,
    uint256 _tokens,
    uint256 _timestamp
  )
    external
    onlyOwner
  {
    require(block.timestamp < _timestamp, "unable to set up disbursement");
    disbursements[_vestor].push(Disbursement(_timestamp, _tokens));
    totalAmount = totalAmount.add(_tokens);
    emit Setup(_vestor, _timestamp, _tokens);
  }

  /// @dev Transfers tokens to the address named address (if they deserve any)
  /// @param _beneficiary The address to transfer tokens to
  function withdraw(address _beneficiary)
    external
  {
    uint256 withdrawAmount = calcMaxWithdraw(_beneficiary);
    require(withdrawAmount != 0, "cannot withdraw 0 tokens");
    withdrawnTokens[_beneficiary] = withdrawnTokens[_beneficiary].add(withdrawAmount);
    require(token.transfer(_beneficiary, withdrawAmount), "unable to transfer");
    emit Withdraw(_beneficiary, withdrawAmount);
  }

  /// @dev Calculates the maximum amount of vested tokens
  /// @return Number of vested tokens that can be withdrawn
  function calcMaxWithdraw(address _beneficiary)
    public
    view
    returns (uint256)
  {
    uint256 maxTokens = 0;

    // Go over all the disbursements and calculate how many tokens can be withdrawn
    Disbursement[] storage temp = disbursements[_beneficiary];
    uint256 tempLength = temp.length;
    for (uint256 i = 0; i < tempLength; i++) {
      if (block.timestamp > temp[i].timestamp) {
        maxTokens = maxTokens.add(temp[i].tokens);
      }
    }

    // Return the computed amount minus the tokens already withdrawn
    return maxTokens.sub(withdrawnTokens[_beneficiary]);
  }

  /// @dev Called by the contract owner to withdraw any tokens in the contract 
  function rescueTokens() external onlyOwner {
    uint256 avail = token.balanceOf(address(this));
    require(token.transfer(owner, avail), "unable to transfer");
  }

  /// @dev Called by the sale contract to cancel a disbursement.
  /// @param _vestor The address of the beneficiary.
  function cancelDisbursement( address _vestor ) external onlyOwner {
    uint256 pending = calcMaxWithdraw(_vestor);
    if (pending > 0) {
      // pay out any available tokens
      this.withdraw(_vestor);
    }
    // remove all of the disbursements
    uint256 amountCancelled = 0;

    // Go over all the disbursements and cancel any remaining disbursements
    Disbursement[] storage temp = disbursements[_vestor];
    uint256 tempLength = temp.length;
    for (uint256 i = 0; i < tempLength; i++) {
      
      if (block.timestamp < temp[i].timestamp && temp[i].tokens > 0) {
        // if the disbursement is in the future then add it to the cancelled list
        cancelledDisbursements[_vestor].push(temp[i]);
        // add the amount cancelled
        amountCancelled = amountCancelled.add(temp[i].tokens);
        delete temp[i];
      }
    }

    cancelledTokens[_vestor] = amountCancelled.add(cancelledTokens[_vestor]);


  }

}