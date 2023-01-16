import * as anchor from "@project-serum/anchor";
import { Program, getProvider, AnchorProvider } from "@project-serum/anchor";
import { ProfilePicture } from "../target/types/profile_picture";
import { PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, createMint } from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

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


    const a = await program.account.user.fetch(user)
  });
});
