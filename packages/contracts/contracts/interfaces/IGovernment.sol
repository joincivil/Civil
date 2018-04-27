pragma solidity ^0.4.19;

/**
@title IGovernemnt
@notice This is an interface that defines the functionality required by a Government
The functions herein are accessed by the CivilTCR contract as part of the appeals process.
@author Nick Reynolds - nick@joincivil.com
*/
interface IGovernment {
  function getAppellate() public view returns (address);
  function getGovernmentController() public view returns (address);
  function get(string name) public view returns (uint);
}
