import * as anchor from "@project-serum/anchor";
import { Program, getProvider, AnchorProvider } from "@project-serum/anchor";
import { ProfilePicture } from "../target/types/profile_picture";
import { PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createMint,
} from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { CreateNftInput, Metaplex, toBigNumber } from "@metaplex-foundation/js";

describe("profile-picture", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ProfilePicture as Program<ProfilePicture>;

  it("Is initialized!", async () => {
    // Add your test here.

    /**
     * Get address of user account
     */
    const [user] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), program.provider.publicKey?.toBuffer()],
      program.programId
    );

    console.log("user", user);

    expect(user).toBeDefined();

    const provider = program.provider as AnchorProvider;
    const wallet = provider.wallet as NodeWallet;

    const { connection } = getProvider();

    // const metaplex = new Metaplex(connection);

    // const input: CreateNftInput = {
    //   name: "My NFT",
    //   symbol: "MYNFT",
    //   uri: "https://arweave.net/...",
    //   sellerFeeBasisPoints: 100,
    //   maxSupply: toBigNumber(1),
    //   creators: [
    //     {
    //       address: wallet.publicKey,
    //       share: 100,
    //     },
    //   ],
    // };

    // const { mintAddress: mint } = await metaplex.nfts().create(input);

    const mint = await createMint(
      connection,
      wallet.payer,
      wallet.payer.publicKey,
      null,
      0,
    )

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint,
      wallet.publicKey
    );

    console.log("tokenAccount", tokenAccount);

    const tx = await program.methods
      .initialize()
      .accounts({
        user,
        tokenAccount: tokenAccount.address,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const { pfp } = await program.account.user.fetch(user);

    /**
     * Get metadata from mint/pfp
     */
    // const metadata = await metaplex.nfts().findByMetadata({
    //   metadata: pfp,
    // });

    console.log(">>>", { pfp });
  });
});
