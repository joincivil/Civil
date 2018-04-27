pragma solidity ^0.4.19;
/**
@title Governemnt
@author Nick Reynolds - nick@joincivil.com
*/
interface IGovernment {
  function getAppellate() public view returns (address);
  function getGovernmentController() public view returns (address);
  function get(string name) public view returns (uint);
}
