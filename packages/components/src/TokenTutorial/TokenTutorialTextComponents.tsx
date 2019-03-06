import * as React from "react";

export const TutorialIntroText: React.SFC = props => <h2>Choose a topic below to get started</h2>;

export const TutorialTimeText: React.SFC = props => <>Approximately 10-15 minutes</>;

export const TutorialSkipText: React.SFC = props => (
  <p>If you’ve read the Civil Constitution and FAQ, skip to the quiz.</p>
);

export interface TutorialProgressTextProps {
  questions: number;
}

export const TutorialProgressText: React.SFC<TutorialProgressTextProps> = props => (
  <>
    You have {props.questions} question{props.questions === 1 ? "" : "s"} left
  </>
);

export const Topic1Intro: React.SFC = props => (
  <>
    <p>
      <b>In this section, you’ll learn</b>
    </p>
    <p>What is Civil, and what makes us different?</p>
    <p>How does a Newsroom join the Civil network?</p>
    <p>What are Civil tokens (CVL)?</p>
    <p>What is the Civil Registry?</p>
  </>
);

export const Topic2Intro: React.SFC = props => (
  <>
    <p>
      <b>In this section, you’ll learn</b>
    </p>
    <p>What is ETH and what is gas?</p>
    <p>What are all the different token wallets?</p>
    <p>What are Public and Private Keys for token wallets?</p>
    <p>What is a recovery phrase (seed)?</p>
  </>
);

export const Topic3Intro: React.SFC = props => (
  <>
    <p>
      <b>In this section, you’ll learn</b>
    </p>
    <p>How are Civil tokens valued over time - do prices fluctuate?</p>
    <p>What factors should you take into consideration when buying Civil tokens?</p>
    <p>How much is safe to consider spending on Civil tokens?</p>
  </>
);

export const Topic1Tutorial1: React.SFC = props => (
  <>
    <h2>What is Civil?</h2>
    <p>
      Civil is a community-operated journalism network based on transparency and trust. It is founded on the principle
      that a free press is essential to a fair and just society.
    </p>
    <p>Civil provides members with a direct say and influence in the project’s operations and long-term evolution.</p>
  </>
);

export const Topic1Tutorial2: React.SFC = props => (
  <>
    <h2>What makes Civil different?</h2>
    <p>
      The Civil network is owned and operated by news organizations and the public they serve. There’s no corporate
      owner deciding who can and cannot publish on Civil. All major decisions on Civil occur transparently and by
      community vote.
    </p>
  </>
);

export const Topic1Tutorial3: React.SFC = props => (
  <>
    <h2>How does a Newsroom join Civil?</h2>
    <h3>Newsroom Application:</h3>
    <ul>
      <li>Newsrooms must fill out an application outlining the Newsroom’s mission and business model.</li>
      <li>Review and Sign the Civil Constitution which sets forth Civil’s journalism standards.</li>
      <li>
        Deposit of US $1,000 worth of Civil tokens towards the Newsroom Application. This states the Newsroom’s intent
        to the Civil community by staking this amount.
      </li>
    </ul>
    <h3>Community Review:</h3>
    <ul>
      <li>
        Any Civil member may challenge a newsroom based on perceived violation of the Civil Constitution by depositing
        US $1,000 worth of Civil tokens.
      </li>
      <li>
        This triggers a community vote whereby members may use their tokens to weigh in (1 token = 1 vote). The majority
        wins a community vote, and members who voted in the majority will earn a reward.
      </li>
      <li>
        Members may appeal a community decision to the Civil Council with another token deposit. The Civil Council's
        decision can be overturned by a 2/3rds vote of all members.
      </li>
    </ul>
  </>
);

export const Topic1Tutorial4: React.SFC = props => (
  <>
    <h2>What are Civil tokens (CVL)?</h2>
    <p>
      Civil tokens (CVL) enable the "community-owned and operated" Civil model to work. A token is a piece of software,
      it's not a physical coin. But it does have value and represents a piece of ownership in the network.
    </p>
    <p>
      For those that want to get more technical, CVL is a utility token based on the ERC20 protocol. It's a value stored
      in a decentralized database that's managed by Civil's smart contracts, which allows the Civil platform to interact
      with the Civil token. CVL is the software that bridges Civil with the Ethereum blockchain.
    </p>
  </>
);

export const Topic1Tutorial5: React.SFC = props => (
  <>
    <h2>What is the Civil Registry?</h2>
    <p>
      Civil Registry is the discovery and interaction hub where the public can find and support Civil newsrooms. This is
      also where our complete decentralized governance experience lives, allowing Civil members to vote and change the
      platform over time, even including proposing amendments to the Civil Constitution itself.
    </p>
  </>
);

export const Topic2Tutorial1: React.SFC = props => (
  <>
    <h2>What is ETH (Ether)?</h2>
    <p>
      Ether (ETH) is the cryptocurrency for the Ethereum blockchain, which Civil uses to enable its community ownership
      model. When you conduct transactions on the blockchain, you must pay for that distributed computing effort. Civil
      does not earn anything from these payments. Instead, they are paid to the global, decentralized network of miners
      that maintain the Ethereum blockchain.
    </p>
  </>
);

export const Topic2Tutorial2: React.SFC = props => (
  <>
    <h2>What are Ethereum transaction fees or “Gas”?</h2>
    <p>
      Ethereum transaction fees (commonly referred to as “gas”) are the cost that you have to pay in order for your
      information to be added to the Ethereum blockchain. You will have to pay gas in Ether (ETH), which you can
      purchase via a cryptocurrency exchange such as{" "}
      <a href="https://www.coinbase.com/" target="_blank">
        Coinbase
      </a>.
    </p>
    <p>
      When sending a transaction, a gas limit is set. You are able to set the gas fee manually, but you must set this
      limit carefully, because if you set it too low and the transaction fails as a result, you will lose the Ether you
      spent in gas. Think about it like paying for postage to send a piece of mail or paying for shipping costs when
      delivering a package.
    </p>
    <p>
      On Civil, we will provide recommended gas amounts to make this process easier (like the post office recommending
      the right postage at time of shipment), but it’s important you understand the mechanics involved.
    </p>
  </>
);

export const Topic2Tutorial3: React.SFC = props => (
  <>
    <h2>What is a token wallet?</h2>
    <p>
      A token wallet is, as in the real world, a place where you can receive, send and store your money - in this case,
      cryptocurrency like Civil tokens and ETH. Unlike other digital products and information, though, only you and you
      alone can control your wallet. Not even The Civil Media Company can retrieve your tokens if they become lost.{" "}
      <b>
        This is what makes decentralized technologies so secure and strong for data privacy, but it’s also why it’s so
        important to learn how it all works.
      </b>
    </p>
    <p>
      Additionally, when using other Civil products (such as the Civil Publisher or Civil Registry), your wallet address
      also proves your identity on the blockchain. Among other things, this helps verify for readers the sources of
      stories on the Civil network.
    </p>
    <p>
      You’ll need an Ethereum wallet-enabled browser such as{" "}
      <a href="https://www.google.com/chrome/" target="_blank">
        Chrome
      </a>,{" "}
      <a href="https://brave.com/" target="_blank">
        Brave
      </a>{" "}
      or{" "}
      <a href="https://www.mozilla.org/en-US/firefox/" target="_blank">
        Firefox
      </a>{" "}
      that supports wallets. We recommend using a{" "}
      <a href="https://metamask.io/" target="_blank">
        MetaMask
      </a>{" "}
      wallet.
    </p>
  </>
);

export const Topic2Tutorial4: React.SFC = props => (
  <>
    <h2>What is a hardware wallet or a ‘cold wallet’?</h2>
    <p>
      A hardware wallet is one of the most secure ways to store Civil tokens and other cryptocurrencies. A hardware
      wallet (also sometimes called a 'cold wallet') is a small device that plugs into your computer via USB. When not
      in use, a hardware wallet should be unplugged from your computer and stored somewhere secure. Among the most
      well-known hardware wallets is the brand{" "}
      <a href="https://trezor.io/" target="_blank">
        Trezor
      </a>.
    </p>
    <p>
      <i>
        <b>Note</b> that while it is the most secure, it can also be the most important to take good care of, because if
        you forget your passwords and your seed phrase, your funds will be irretrievably lost. Remember that the Civil
        Media Company does not store any of your wallet information.
      </i>
    </p>
  </>
);

export const Topic2Tutorial5: React.SFC = props => (
  <>
    <h2>What is a software wallet or a ‘hot wallet’?</h2>
    <p>
      A software wallet describes any wallet that stores its cryptocurrency on an online exchange, as opposed to stored
      offsite. While having the wallet connected to the exchange makes it less likely you will lose your login
      information, the risk is higher that you could be hacked and your currency taken, as has been the case on some
      exchanges in the past.{" "}
      <a href="https://metamask.io/" target="_blank">
        MetaMask
      </a>{" "}
      is a software wallet that we support and recommend.
    </p>
    <p>
      A hot wallet, refers to any wallet that you use for more frequent transactions (and could include a software
      online wallet connected to an exchange as described above). Best practices recommend storing larger quantities of
      currency in a separate{" "}
      <a href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360016464892-What-is-a-hot-wallet-#" target="_blank">
        cold wallet
      </a>{" "}
      (like a savings account) — and transferring smaller sums into a hot wallet for frequent transactions.
    </p>
    <p>
      <i>
        <b>Note</b> It’s extremely common to have multiple wallets to manage your tokens. The same way you have a bank
        website, an ATM, a credit card, a checkbook and physical cash in your wallet — these are all different ways to
        access, withdraw, transfer, spend, receive and monitor funds. Token wallets are not dissimilar, and hardware
        wallets and software wallets have equal advantages and disadvantages in terms of accessibility, security, and
        liquidity that make one better than the other for certain tokens and portions of token holdings.
      </i>
    </p>
  </>
);

export const Topic2Tutorial6: React.SFC = props => (
  <>
    <h2>What is a public wallet address?</h2>
    <p>
      This is the public identity that all instructions sent to the Ethereum blockchain and IPFS will be identified
      with. It typically begins with an 0x and is a string of unique numbers that looks something like this:
      0xC2D7CF95645D12004210B78989035C7c9061d3F9
    </p>
    <p>
      We use your public wallet address to sign, index and archive posts within the Civil Publisher, and to apply,
      challenge, vote and appeal within the Civil Registry. It’s also where Civil tokens and ETH are sent to or from in
      order to transmit funds, pay for transactions, or earn rewards.
    </p>
  </>
);

export const Topic2Tutorial7: React.SFC = props => (
  <>
    <h2>What is a private key?</h2>
    <p>
      Your private key gives you or anyone who has it direct access to your wallet. Be <b>extremely careful</b> with
      your private keys and the “seed phrases” you might also be using in systems like MetaMask. Do not ever store them
      on a computer or email them anywhere, not even to yourself. If someone hacks into your wallet using your private
      key, they can take all of your funds and you cannot get them back.
    </p>
    <p>
      On a hardware wallet, your private key never leave the device. On a software wallet, your private key is stored on
      your computer or an online exchange and could potentially be revealed if they are hacked.
    </p>
    <p>
      <i>
        <b>Note</b> that many phishing campaigns ask for your private key, which would help them gain access to your
        accounts. The Civil Media Company will <b>never</b> ask you to share or use your private key. We <b>only</b> use
        and display your public wallet address. You should <b>never</b> share your private key with anyone.
      </i>
    </p>
  </>
);

export const Topic2Tutorial8: React.SFC = props => (
  <>
    <h2>What is a recovery phrase (seed phrase) and why is it important to secure it?</h2>
    <p>
      Any time a wallet is set up, users are provided with a unique recovery phrase or “seed” composed of anywhere from
      12–24 randomized words. Recovery seeds are considered the most important aspect of maintaining the safety of your
      cryptocurrencies. A recovery seed is your best friend when you lose your wallet, as it’s the only way you can
      recover your funds. Many individuals skip writing down their recovery seed when setting up a wallet. Don’t make
      this mistake.
    </p>
    <p>
      Similar to the private key, be{" "}
      <b>
        <i>EXTREMELY CAREFUL</i>
      </b>{" "}
      with your seed phrase. Do not save it on a computer or email it anywhere, not even to yourself. Don’t even type or
      save the recovery seed online. In short, do not save it in a digital format. Do write your seed phase down on
      paper and keep it in a safe, memorable place (two copies are best).
    </p>
    <p>
      <i>
        If you lose the private key of the wallet holding your tokens and don’t have your seed phrase, you won’t be able
        to recover your tokens.
      </i>
    </p>
  </>
);

export const Topic3Tutorial1: React.SFC = props => (
  <>
    <h2>How are Civil tokens valued over time - do prices fluctuate?</h2>
    <p>
      Civil tokens are a cryptocurrency — and just like any currency, they increase and decrease in value over time
      based on relevant market conditions. Typically, tokens fluctuate in price due to various factors including the
      total circulating supply of tokens, how many people are in the network, how often they use tokens, and how often
      tokens are bought and sold on the open market.
    </p>
    <p>
      Civil tokens are specifically designed to change in price over time based on the growth and health of the Civil
      network overall — the more high-quality newsrooms on Civil, the more demand for Civil tokens compared to a fixed
      (or even diminishing) supply of freely circulating tokens. While other tokens may be attractive to passive
      speculators, Civil tokens are meant to incentivize community participation in order to increase the usefulness of
      the Civil network overall for everyone.
    </p>
  </>
);

export const Topic3Tutorial2: React.SFC = props => (
  <>
    <h2>What factors should you take into consideration when buying Civil tokens?</h2>
    <p>
      <b>
        You should buy Civil tokens only because you wish to participate in our community-run project for journalism.
      </b>{" "}
      That said, like any financial decision, it is important to do your research before buying. Make sure you
      understand how the Civil token works, and how the mechanics may affect the price over time. It’s also a good idea
      to{" "}
      <a href="https://civil.co/our-team/" target="_blank">
        learn more about the project team at Civil
      </a>.
    </p>
  </>
);

export const Topic3Tutorial3: React.SFC = props => (
  <>
    <h2>How much is safe to consider spending on Civil tokens?</h2>
    <p>
      There are no guaranteed outcomes or guaranteed returns with Civil tokens. While the value of Civil tokens may
      increase over time, you also must be prepared to lose some or all of their value. Maintaining your financial
      stability is crucial. Don’t buy more Civil tokens than you can afford to lose, and think carefully before you
      borrow against credit cards, bank loans or personal loans in order to buy Civil tokens. Please be aware that
      nobody (including but not limited to anyone associated with the Civil token, the Civil Network, or the Civil token
      sale) is agreeing or obligated to, or responsible for, creating any type of financial return for you in
      association with your purchase of Civil tokens.
    </p>
  </>
);
