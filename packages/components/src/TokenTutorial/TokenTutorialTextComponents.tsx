import * as React from "react";

export const TutorialIntroText: React.SFC = props => (
  <>
    <h2>Choose a topic below to get started</h2>
    <p>First, let’s walk through a topic. Then, answer a few questions at the end of each section.</p>
  </>
);

export const TutorialTimeText: React.SFC = props => <>30 minutes</>;

export const TutorialSkipText: React.SFC = props => (
  <p>
    <b>Skip the walkthrough and take the quiz.</b> If you’ve read our white paper, the Civil Constitution, and FAQ, skip
    to the quiz.
  </p>
);

export const TutorialSkipBtnText: React.SFC = props => <>Take the quiz</>;

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
      <b>You’ll learn</b>
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
      <b>You’ll learn</b>
    </p>
    <p>What is ETH? And what is gas?</p>
    <p>What are all the different crypto wallets?</p>
    <p>What are Public and Private Keys?</p>
    <p>What is a recovery phrase (seed) and why is it important to secure it?</p>
  </>
);

export const Topic3Intro: React.SFC = props => (
  <>
    <p>
      <b>You’ll learn</b>
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
    <p>This provides members with a direct say and influence in the project’s operations and long-term evolution.</p>
  </>
);

export const Topic1Tutorial2: React.SFC = props => (
  <>
    <h2>What makes Civil different?</h2>
    <p>
      The Civil network is owned and operated by member news organizations and the readers they serve. There’s no
      corporate owner taking cuts of membership or subscription payments to newsrooms, nor telling them what they can or
      can’t publish. All major decisions on Civil occur transparently and by community consensus.
    </p>
  </>
);

export const Topic1Tutorial3: React.SFC = props => (
  <>
    <h2>How does a Newsroom join the Civil Network?</h2>
    <h3>APPLY:</h3>
    <ul>
      <li>Newsrooms must fill out an application outlining the Newsroom’s mission and business model.</li>
      <li>Review and Sign the Civil Constitution which sets forth Civil’s journalism standards.</li>
      <li>
        Deposit of US $1,000 worth of Civil tokens [to state the seriousness of their intent, and to formally enact the
        process of gaining access to the Civil Registry.]
      </li>
    </ul>
    <h3>COMMUNITY REVIEW:</h3>
    <ul>
      <li>
        Any Civil member may challenge a newsroom based on perceived violation of the Civil Constitution. That triggers
        a community vote that may result in a newsroom being removed from the registry.
      </li>
      <li>
        Appeals may be made to the Civil Council which is comprised of journalists and academics. They may overturn
        community decisions.
      </li>
    </ul>
  </>
);

export const Topic1Tutorial4: React.SFC = props => (
  <>
    <h2>What are Civil tokens (CVL)?</h2>
    <p>
      Civil tokens are a consumer token based on the{" "}
      <a href="https://theethereum.wiki/w/index.php/ERC20_Token_Standard" target="_blank">
        ERC20 protocol
      </a>. It’s a value stored in a decentralized database that’s managed by Civil’s smart contracts, which allows the
      Civil network to interact with the Civil token. Civil tokens are the software that bridges the Civil network with
      the Ethereum blockchain, and it’s what enables our community ownership model.
    </p>
    <p>
      When you buy Civil tokens, you’re signaling that you wish to participate in and contribute to Civil’s community.
      Civil tokens unlock specific activities on the Civil platform, including sponsoring or launching a newsroom,
      challenging and voting for/against Newsrooms for ethics violations or appealing the outcome of a community vote to
      the Civil Council.
    </p>
    <p>
      Owning Civil tokens means owning a piece of the Civil network. There will only ever be a fixed supply of Civil
      tokens created. Owners of Civil tokens will be economically incentivized to ensure existing and future Civil
      Newsrooms maintain high quality standards as the network, and its reach, grows.
    </p>
  </>
);

export const Topic1Tutorial5: React.SFC = props => (
  <>
    <h2>What is the Civil Registry?</h2>
    <p>
      The Civil Registry is the community-driven space to curate quality journalism. Prospective Civil Newsrooms must
      apply to the Registry to access publishing rights on the Civil platform. You can apply to the Civil Registry after
      setting up your Newsroom Smart Contract in the Publisher plugin.
    </p>
    <p>
      Inclusion in the Civil Registry means that the community has vetted a Newsroom and deemed it as having a credible,
      journalistic mission, and that it has pledged to adhere to the journalistic ethics outlined by the{" "}
      <a href="https://civil.co/constitution" target="_blank">
        Civil Constitution.
      </a>
    </p>
    <p>
      The Registry is designed with checks and balances in place to ensure that all voices and perspectives have an
      opportunity to be heard in the Civil Community. The different governance processes that exist on the Registry are
      Application, Challenge, Vote, Appeal. Civil community members can earn CVL tokens by initiating successful
      challenges and appeals as well as by voting among the majority in community decisions.
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
      purchase via{" "}
      <a href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360016789371-What-is-MetaMask-" target="_blank">
        MetaMask
      </a>{" "}
      and a cryptocurrency exchange such as{" "}
      <a href="https://www.coinbase.com/" target="_blank">
        Coinbase
      </a>.
    </p>
    <p>
      When sending a transaction, a gas limit is set. You are able to set the gas fee manually, but you must set this
      limit carefully, because if you set it too low and the transaction fails as a result, you will lose the Ether
      (ETH) or gas that you spent. Think about it like paying for postage to send a piece of mail or paying for shipping
      costs when delivering a package.
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
      Similar to a physical wallet, a token wallet is where you can store, send and receive tokens. Unlike other digital
      products and information, though, only you and you alone can control your token wallet. Not even The Civil Media
      Company can retrieve your tokens if they become lost.{" "}
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
      A hardware wallet is a kind of token wallet, and it’s one of the most secure ways to store Civil tokens and other
      cryptocurrencies. A hardware wallet (also sometimes called a ‘cold wallet’) is a small device that plugs into your
      computer via USB. When not in use, a hardware wallet should be unplugged from your computer and stored somewhere
      safe. Among the most well-known hardware wallets is the brand{" "}
      <a href="https://trezor.io/" target="_blank">
        Trezor
      </a>.
    </p>
    <p>
      Reminder: While the most secure, it’s most important to take good care of your hardware wallet because if you
      forget your passwords and your seed phrase, your tokens will be irretrievably lost. Remember that the Civil Media
      Company does not store any of your wallet information.
    </p>
  </>
);

export const Topic2Tutorial5: React.SFC = props => (
  <>
    <h2>What is a software wallet or a ‘hot wallet’?</h2>
    <p>
      A software wallet (also sometimes called a ‘hot wallet’) is a kind of token wallet, describes any wallet address
      that stores its cryptocurrency on an online exchange, as opposed to stored offsite. While having the wallet
      connected to the exchange makes it less likely you will lose your login information, the risk is higher that you
      could be hacked and your currency taken, as has been the case on some exchanges in the past.{" "}
      <a href="https://metamask.io/" target="_blank">
        MetaMask
      </a>{" "}
      is a software wallet that we support and recommend.
    </p>
    <p>
      Best practices recommend storing small quantities of crypto-currency in a software wallet or ‘hot wallet’ for
      frequent transactions. However, for larger quantities of crypto-currency, it is safer to store them in a hardware
      wallet or{" "}
      <a href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360016464892-What-is-a-hot-wallet-#" target="_blank">
        ‘cold wallet’
      </a>.
    </p>
    <p>
      Note: It’s extremely common to have multiple wallets to manage your tokens. The same way you have a bank website,
      an ATM, a credit card, a checkbook and physical cash in your wallet — these are all different ways to access,
      withdraw, transfer, spend, receive and monitor funds. Token wallets are not dissimilar, and hardware wallets and
      software wallets have equal advantages and disadvantages in terms of accessibility, security, and liquidity that
      make one better than the other for certain tokens and portions of token holdings.
    </p>
  </>
);

export const Topic2Tutorial6: React.SFC = props => (
  <>
    <h2>What is a public wallet address?</h2>
    <p>
      Every token wallet has a public wallet address, which looks something like this:
      0xC2D7CF95645D12004210B78989035C7c9061d3F9
    </p>
    <p>
      This unique address acts as your identity or account number on the Ethereum blockchain. We use your public wallet
      address to sign, index and archive posts within the Civil Publisher, and to apply, challenge, vote and appeal
      within the Civil Registry. It’s also where Civil tokens and ETH are sent to or from in order to transmit funds,
      pay for transactions, or earn rewards.
    </p>
  </>
);

export const Topic2Tutorial7: React.SFC = props => (
  <>
    <h2>What is a private key?</h2>
    <p>
      Your private key gives direct access to and control of your token wallet. It’s like a very powerful password,
      except it cannot be recovered if lost and it should not be shared with anyone. <b>Be extremely careful</b> with
      your private keys and the “seed phrases” you might also be using in systems like MetaMask. Do not ever store them
      on a computer or email them anywhere, not even to yourself.
    </p>
    <p>
      <i>
        <b>Tips:</b>
      </i>
    </p>
    <p>
      <i>
        Don’t ever even type or copy or duplicate private keys or seed phrases onto a keyboard, keypad, clipboard,
        scanner or printer. Do write them down on a piece of paper and keep it in a safe, memorable place.
      </i>
    </p>
    <p>
      <i>
        Many phishing campaigns ask for your private key, which would help them gain access to your accounts. You should
        never share your private key with anyone.
      </i>
    </p>
  </>
);

export const Topic2Tutorial8: React.SFC = props => (
  <>
    <h2>What is a seed phrase and why is it important to secure it?</h2>
    <p>
      Every token wallet comes with a unique “seed phrase” — typically a set of 12-24 random words — that can be used to
      recover a lost wallet. They are the most important aspect of maintaining your Civil tokens and other
      cryptocurrencies safely. A seed phrase is your best friend when you lose your wallet, as it’s the only way you can
      recover your tokens. Many individuals skip writing down their recovery seed when setting up a wallet. Don’t make
      this mistake.
    </p>
    <p>
      Similar to the private key, <b>be extremely careful</b> with your seed phrase. Do not save it on a computer or
      email it anywhere, not even to yourself. Don’t even type or save the recovery seed online. In short, do not save
      it in a digital format. Do write your seed phase down on paper and keep it in a safe, memorable place (two copies
      are best).
    </p>
    <p>
      If you lose the private key of the wallet holding your tokens and don’t have your seed phrase, you won’t be able
      to recover your tokens.
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
      tokens are bought and sold on the open market. Civil tokens are specifically designed to change in price over time
      based on the growth and health of the Civil network overall — the more high-quality newsrooms on Civil, the more
      demand for Civil tokens compared to a fixed (or even diminishing) supply of freely circulating tokens. While other
      tokens may be attractive to passive speculators, Civil tokens are meant to incentivize community participation in
      order to increase the value of the Civil network overall for everyone.
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
      understand how the Civil token works conceptually, and how the mechanics should affect the price over time. It’s
      also a good idea to{" "}
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
      borrow against credit cards, bank loans or personal loans in order to buy Civil tokens.
    </p>
  </>
);
