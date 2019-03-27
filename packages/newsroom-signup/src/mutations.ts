import gql from "graphql-tag";

export const saveCharterMutation = gql`
  mutation($input: CharterInput!) {
    nrsignupSaveCharter(charterData: $input)
  }
`;

export const SaveAddressMutation = gql`
  mutation($input: String!) {
    nrsignupSaveAddress(address: $input)
  }
`;

export const SaveTxMutation = gql`
  mutation($input: String!) {
    nrsignupSaveTxHash(txHash: $input)
  }
`;

export const requestGrantMutation = gql`
  mutation($input: Boolean!) {
    nrsignupRequestGrant(requested: $input)
  }
`;
