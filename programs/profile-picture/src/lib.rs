use anchor_lang::prelude::*;
use std::mem::size_of;
use anchor_spl::token::TokenAccount;


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod profile_picture {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.user.pfp = ctx.accounts.token_account.mint;

        Ok(())
    }

}


#[account]
#[derive(Default)]
pub struct User {
    pfp: Pubkey
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, seeds = [b"user", owner.key().as_ref()], bump, space = 8 + size_of::<User>())]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub owner: Signer<'info>,
    system_program: Program<'info, System>,
    #[account(
        constraint = user.pfp != token_account.mint,
        has_one = owner
    )]
    pub token_account: Account<'info, TokenAccount>
}
