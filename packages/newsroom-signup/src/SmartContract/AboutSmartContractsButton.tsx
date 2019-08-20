import * as React from "react";
import { InvertedButton, buttonSizes } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import { InfoModalButton, Header, SectionHeader, Paragraph } from "../InfoModalButton";

export class AboutSmartContractsButton extends React.Component {
  public render(): JSX.Element | null {
    return (
      <InfoModalButton
        buttonText="Learn more about Newsroom Smart Contracts"
        content={
          <>
            <Header>About Newsroom Smart Contracts</Header>
            <Paragraph>
              In this section, we explain the difference between the Smart Contract Address and Public Address and why
              this is important to your Newsroom.
            </Paragraph>

            <SectionHeader>Newsroom Smart Contract</SectionHeader>
            <Paragraph>
              Smart contracts help you record activity and exchange things of value in a transparent, conflict-free way
              while avoiding intermediary services. The public can find a newsroom by its contract address in order to
              see its activities on the blockchain. You cannot send funds directly to a newsroom smart contract.
            </Paragraph>
            <Paragraph>
              In the case of Civil Registry and Publisher, this newsroom smart contract code allows you to create and
              maintain a decentralized index and/or archive of your content and control who has permission to update it.
              In combination with your newsroom wallet address, the smart contract acts as a verification for your
              newsroom's identity.
            </Paragraph>
            <Paragraph>
              Using Civil's publishing tools, your content can be indexed on the Civil network, which provides a way to
              track it back to your website, along with proof that the contents have not changed since last publish.
            </Paragraph>
            <Paragraph>
              Archiving will save the full text of your post to IPFS and, if you choose, the Ethereum blockchain. You
              will also publish an index of the post to provide proof that its contents have not changed. This will
              create a permanent record of the full text of your story, in a way cannot be easily altered or removed.
            </Paragraph>

            <SectionHeader>Newsroom Wallet</SectionHeader>
            <Paragraph>
              The newsroom wallet, identified by its public wallet address, is used to manage permissions for your
              newsroom smart contract. This specific type of wallet is a "multisignature wallet" ("multisig") which
              means that multiple parties have control over it. Only Officers can control the newsroom smart contract,
              which they do via this multisig. It is also a place where you can send, receive, and store your newsroom
              funds.
            </Paragraph>

            <SectionHeader>Newsroom Smart Contract Roles</SectionHeader>
            <Paragraph>
              You need to assign role to key staff in your newsrooms. This will determine their level of access to the
              newsroom smart contract. There are three distinct roles:
            </Paragraph>
            <Paragraph>
              Officer - an admin role that has full access to newsroom smart contract functions, including adding other
              officers to the newsroom contract; signing, indexing, and archiving posts; and controlling funds.
            </Paragraph>
            <Paragraph>
              Member - standard role that has access to the tools to sign, index, and archive posts on the blockchain.
              They cannot add Civil Officers to a newsroom contract but can add other members.
            </Paragraph>
            <Paragraph>
              None - you may choose "None" for staff that you wish to include in your roster but who don't need access
              to your newsroom smart contract.
            </Paragraph>
            <Paragraph>These roles will appear on your Civil Registry profile.</Paragraph>

            <InvertedButton size={buttonSizes.SMALL} target="_blank" href={urlConstants.FAQ_WHAT_IS_SMART_CONTRACT}>
              Read more on our FAQ
            </InvertedButton>
          </>
        }
      />
    );
  }
}
