pragma solidity ^0.4.23;

interface GroupsI {
  function find(address a) external view returns (address root, uint size);
}
