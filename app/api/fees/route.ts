import { NextResponse } from "next/server";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function GET() {
	try {
		// Get RPC endpoint from environment or use default (devnet)
		const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
		const connection = new Connection(rpcUrl, "confirmed");

		// Get recent prioritization fees
		let recentPrioritizationFees: number[] = [];
		try {
			const fees = await connection.getRecentPrioritizationFees();
			recentPrioritizationFees = fees.map((f) => f.prioritizationFee).filter((f) => f > 0);
		} catch (e) {
			console.error("Failed to fetch prioritization fees:", e);
		}

		// Calculate average and median prioritization fees
		const avgPriorityFee = recentPrioritizationFees.length > 0
			? recentPrioritizationFees.reduce((a, b) => a + b, 0) / recentPrioritizationFees.length
			: 0;
		
		const sortedFees = [...recentPrioritizationFees].sort((a, b) => a - b);
		const medianPriorityFee = sortedFees.length > 0
			? sortedFees[Math.floor(sortedFees.length / 2)]
			: 0;

		// Base transaction fee (5000 lamports = 0.000005 SOL)
		const baseFeeLamports = 5000;
		const baseFeeSol = baseFeeLamports / LAMPORTS_PER_SOL;

		// Estimated fees for different transaction types (in lamports)
		const feeEstimates = {
			simpleTransfer: baseFeeLamports, // Basic SOL transfer
			tokenTransfer: baseFeeLamports + 5000, // Token transfer (~10k lamports)
			swap: baseFeeLamports + 10000 + Math.floor(avgPriorityFee), // DEX swap with priority
			nftTransfer: baseFeeLamports + 5000, // NFT transfer
			smartContract: baseFeeLamports + 15000 + Math.floor(avgPriorityFee), // Program interaction
		};

		return NextResponse.json({
			ok: true,
			data: {
				baseFee: {
					lamports: baseFeeLamports,
					sol: baseFeeSol,
				},
				prioritizationFees: {
					average: avgPriorityFee,
					median: medianPriorityFee,
					min: recentPrioritizationFees.length > 0 ? Math.min(...recentPrioritizationFees) : 0,
					max: recentPrioritizationFees.length > 0 ? Math.max(...recentPrioritizationFees) : 0,
				},
				estimates: {
					simpleTransfer: {
						lamports: feeEstimates.simpleTransfer,
						sol: feeEstimates.simpleTransfer / LAMPORTS_PER_SOL,
					},
					tokenTransfer: {
						lamports: feeEstimates.tokenTransfer,
						sol: feeEstimates.tokenTransfer / LAMPORTS_PER_SOL,
					},
					swap: {
						lamports: feeEstimates.swap,
						sol: feeEstimates.swap / LAMPORTS_PER_SOL,
					},
					nftTransfer: {
						lamports: feeEstimates.nftTransfer,
						sol: feeEstimates.nftTransfer / LAMPORTS_PER_SOL,
					},
					smartContract: {
						lamports: feeEstimates.smartContract,
						sol: feeEstimates.smartContract / LAMPORTS_PER_SOL,
					},
				},
			},
		});
	} catch (e: any) {
		console.error("Fee fetch error:", e);
		return NextResponse.json(
			{ error: e.message || "Failed to fetch fees" },
			{ status: 500 }
		);
	}
}

