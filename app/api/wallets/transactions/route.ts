import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

export async function POST(request: Request) {
	try {
		const { address, limit = 20 } = await request.json();
		if (!address || typeof address !== "string") {
			return NextResponse.json({ error: "Missing address" }, { status: 400 });
		}

		// Get RPC endpoint from environment or use default (devnet)
		const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
		const connection = new Connection(rpcUrl, "confirmed");

		let publicKey: PublicKey;
		try {
			publicKey = new PublicKey(address);
		} catch (e) {
			return NextResponse.json({ error: "Invalid Solana address" }, { status: 400 });
		}

		// Get recent signatures
		const signatures = await connection.getSignaturesForAddress(publicKey, { limit });

		// Get transaction details
		const transactions = await Promise.all(
			signatures.map(async (sig) => {
				try {
					const tx = await connection.getTransaction(sig.signature, {
						maxSupportedTransactionVersion: 0,
					});

					// Calculate SOL amount transferred
					let solAmount = 0;
					let type: "sent" | "received" | "swap" | "other" = "other";
					
					if (tx?.meta) {
						const preBalance = tx.meta.preBalances[0] || 0;
						const postBalance = tx.meta.postBalances[0] || 0;
						solAmount = (preBalance - postBalance) / 1e9;
						
						// Determine transaction type
						if (Math.abs(solAmount) > 0.0001) {
							type = solAmount < 0 ? "sent" : "received";
						}
						
						// Check if it's a swap (has token transfers)
						if (tx.meta.postTokenBalances && tx.meta.postTokenBalances.length > 0) {
							type = "swap";
						}
					}

					return {
						signature: sig.signature,
						blockTime: sig.blockTime,
						slot: sig.slot,
						err: sig.err,
						solAmount: Math.abs(solAmount),
						type,
						status: sig.err ? "failed" : "success",
					};
				} catch (e) {
					// Return basic info even if full transaction fetch fails
					return {
						signature: sig.signature,
						blockTime: sig.blockTime,
						slot: sig.slot,
						err: sig.err,
						solAmount: 0,
						type: "other" as const,
						status: sig.err ? "failed" : "success",
					};
				}
			})
		);

		return NextResponse.json({
			ok: true,
			data: transactions.filter((tx) => tx !== null),
		});
	} catch (e: any) {
		console.error("Transaction fetch error:", e);
		return NextResponse.json(
			{ error: e.message || "Failed to fetch transactions" },
			{ status: 500 }
		);
	}
}

