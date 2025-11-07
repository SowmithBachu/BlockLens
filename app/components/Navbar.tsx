"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050816]/70 backdrop-blur-sm">
			<div className="flex w-full items-center px-4 py-4 sm:px-6 lg:px-10">
				<Link href="/" className="flex items-center">
					<span
						className="text-4xl font-normal tracking-tight text-white"
						style={{ fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif" }}
					>
						BlockLens
					</span>
				</Link>
				<nav className="ml-auto flex items-center gap-5 text-sm text-slate-200">
					<Link href="/dashboard" className="rounded-lg px-3 py-2 transition hover:bg-white/10">
						Dashboard
					</Link>
					<Link href="/gasfee" className="rounded-lg px-3 py-2 transition hover:bg-white/10">
						Gas Fees
					</Link>
				</nav>
			</div>
		</header>
	);
}


