pragma solidity ^0.4.23;

/*
* not finished
*/
contract RootCommits {

  mapping(address => MRoot[]) identities;

  struct MRoot {
    uint64 BlockN;
    uint64 BlockTimestamp;
    bytes32 Root;
  }

  // event called when a root is updated
  event RootUpdated(address addr, uint64 blockN, uint64 timestamp, bytes32 root);

  function setRoot(bytes32 _root) public {
      if(identities[msg.sender].length>0){
        require(identities[msg.sender][identities[msg.sender].length-1].BlockN!=block.number, "no multiple set in the same block");
      }
      identities[msg.sender].push(MRoot(uint64(block.number), uint64(block.timestamp), _root));
      emit RootUpdated(msg.sender, uint64(block.number), uint64(block.timestamp), _root);
  }

  function getRoot(address _address) public view returns (bytes32){
      return identities[_address][identities[_address].length-1].Root;
  }

  /*
  * binary search
  */
  function getRootByBlock(address _address, uint64 _blockN) public view returns (bytes32) {
      require(_blockN<block.number, "errNoFutureAllowed");
      uint min = 0;
      uint max = identities[_address].length-1;
      while(min<=max) {
          uint mid = (max + min)/ 2;
          if(identities[_address][mid].BlockN==_blockN) {
              return identities[_address][mid].Root;
          } else if((_blockN>identities[_address][mid].BlockN) && (_blockN<identities[_address][mid+1].BlockN)) {
              return identities[_address][mid].Root;
          } else if(_blockN>identities[_address][mid].BlockN) {
              min = mid + 1;
          } else {
              max = mid -1;
          }
      }
      return;
  }
  function getRootByTime(address _address, uint64 _timestamp) public view returns (bytes32) {
      require(_timestamp<block.timestamp, "errNoFutureAllowed");
      if(identities[_address].length==0) {
        bytes32 emptyRoot;
        return emptyRoot;
      }
      uint min = 0;
      uint max = identities[_address].length-1;
      while(min<=max) {
          uint mid = (max + min)/ 2;
          if(identities[_address][mid].BlockTimestamp==_timestamp) {
              return identities[_address][mid].Root;
          } else if((_timestamp>identities[_address][mid].BlockTimestamp) && (_timestamp<identities[_address][mid+1].BlockTimestamp)) {
              return identities[_address][mid].Root;
          } else if(_timestamp>identities[_address][mid].BlockTimestamp) {
              min = mid + 1;
          } else {
              max = mid -1;
          }
      }
      return;
  }

}
