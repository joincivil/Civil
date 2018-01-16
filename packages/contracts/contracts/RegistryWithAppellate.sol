pragma solidity 0.4.18;
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract RegistryWithAppellate is Ownable {
/* 
TODO: Extend ACL & Registry (Mike Goldin)
https://github.com/skmgoldin/tcr/blob/master/contracts/Registry.sol
*/

  event AppealRequested(address indexed listing);
  event AppealGranted(address indexed listing);
  event AppealDenied(address indexed listing);

  struct Listing {  
    address owner; // owner of listing 
    uint timestamp;
    bool whitelisted;
  }

  // Maps listingHashes to associated listing data
  mapping(address => Listing) public listings;

  /// @dev returns true if listing is whitelisted
  function isWhitelisted(address listing) public view returns (bool whitelisted) {
    return listings[listing].whitelisted;
  }

  function isAppealInProgress(address listing) public view returns (bool appealing) {
    return listings[listing].owner != 0x0 && !listings[listing].whitelisted;
  }

  function listingOwner(address listing) public view returns (address) {
    return listings[listing].owner;
  }

  function timestampOfAppeal(address listing) public view returns (uint) {
    return listings[listing].timestamp;
  }

  function submitAppeal(address listing) public returns (address) {
    require(listings[listing].owner == 0x0);
    require(!listings[listing].whitelisted); 

    listings[listing] = Listing(
      msg.sender,
      now,
      false
    );
    AppealRequested(listing);
    return listing;
  }

  function grantAppeal(address listing) public onlyOwner {
    require(listings[listing].owner != 0x0);
    require(!listings[listing].whitelisted);
    listings[listing].whitelisted = true;
    // TODO: Fire Registry event as well
    AppealGranted(listing);
  }

  function denyAppeal(address listing) public onlyOwner {
    require(listings[listing].owner != 0x0);
    require(!listings[listing].whitelisted);
    delete listings[listing];
    AppealDenied(listing);
  }
}
