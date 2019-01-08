pragma solidity ^0.4.24;
import "./Managed.sol";

contract ManagedWhitelist is Managed {
  // CORE - addresses that are controller by Civil Foundation, Civil Media, or Civil Newsrooms
  mapping (address => bool) public coreList;
  // CIVILIAN - addresses that have completed the tutorial
  mapping (address => bool) public civilianList;
  // UNLOCKED - addresses that have completed "proof of use" requirements
  mapping (address => bool) public unlockedList;
  // VERIFIED - addresses that have completed KYC verification
  mapping (address => bool) public verifiedList;
  // STOREFRONT - addresses that will sell tokens on behalf of the Civil Foundation. these addresses can only transfer to VERIFIED users
  mapping (address => bool) public storefrontList;
  // NEWSROOM - multisig addresses created by the NewsroomFactory
  mapping (address => bool) public newsroomMultisigList;

  // addToCore allows a manager to add an address to the CORE list
  function addToCore (address operator) public onlyManagerOrOwner { 
    coreList[operator] = true; 
  }

  // removeFromCore allows a manager to remove an address frin the CORE list
  function removeFromCore (address operator) public onlyManagerOrOwner { 
    coreList[operator] = false; 
  } 

  // addToCivilians allows a manager to add an address to the CORE list
  function addToCivilians (address operator) public onlyManagerOrOwner { 
    civilianList[operator] = true; 
  } 

  // removeFromCivilians allows a manager to remove an address from the CORE list
  function removeFromCivilians (address operator) public onlyManagerOrOwner { 
    civilianList[operator] = false; 
  } 
  // addToUnlocked allows a manager to add an address to the UNLOCKED list
  function addToUnlocked (address operator) public onlyManagerOrOwner { 
    unlockedList[operator] = true; 
  } 

  // removeFromUnlocked allows a manager to remove an address from the UNLOCKED list
  function removeFromUnlocked (address operator) public onlyManagerOrOwner { 
    unlockedList[operator] = false; 
  } 

  // addToVerified allows a manager to add an address to the VERIFIED list
  function addToVerified (address operator) public onlyManagerOrOwner { 
    verifiedList[operator] = true; 
  } 
  // removeFromVerified allows a manager to remove an address from the VERIFIED list
  function removeFromVerified (address operator) public onlyManagerOrOwner { 
    verifiedList[operator] = false; 
  } 

  // addToStorefront allows a manager to add an address to the STOREFRONT list
  function addToStorefront (address operator) public onlyManagerOrOwner { 
    storefrontList[operator] = true; 
  } 
  // removeFromStorefront allows a manager to remove an address from the STOREFRONT list
  function removeFromStorefront (address operator) public onlyManagerOrOwner { 
    storefrontList[operator] = false; 
  }

  // addToNewsroomMultisigs allows a manager to remove an address from the STOREFRONT list
  function addToNewsroomMultisigs (address operator) public onlyManagerOrOwner {
    newsroomMultisigList[operator] = true;
  }
  // removeFromNewsroomMultisigs allows a manager to remove an address from the STOREFRONT list
  function removeFromNewsroomMultisigs (address operator) public onlyManagerOrOwner {
    newsroomMultisigList[operator] = false;
  }

  function checkProofOfUse (address operator) public {

  }

}
