<script lang="ts">
	import { chips } from "$lib/stores/chips";

	const symbols = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "💎"] as const;
	type Symbol = typeof symbols[number];

	const weights: Record<Symbol, number> = {
		"🍒": 6,
		"🍋": 6,
		"🔔": 4,
		"⭐": 3,
		"7️⃣": 2,
		"💎": 1
	};

	const paytable: Record<string, number> = {
		"7️⃣7️⃣7️⃣": 50,
		"💎💎💎": 20,
		"🔔🔔🔔": 10,
		"⭐⭐⭐": 5,
		"🍒🍒🍒": 3,
		"🍋🍋🍋": 2
	};

	function spinReel(): Symbol {
		const total = Object.values(weights).reduce((a, b) => a + b, 0);
		let r = Math.random() * total;
		for (const s of symbols) {
			r -= weights[s];
			if (r <= 0) return s;
		}
		return symbols[0];
	}

	let reels: Symbol[] = ["🍒", "🍋", "🔔"];
	let bet = 20;
	let spinning = false;
	let message = "Place your bet and spin";

	function spin() {
		if (spinning) return;
		if (!chips.bet(bet)) {
			message = "Not enough chips";
			return;
		}
		spinning = true;
		message = "Spinning...";
		setTimeout(() => {
			reels = [spinReel(), spinReel(), spinReel()];
			const key = reels.join("");
			let win = 0;
			if (paytable[key]) {
				win = paytable[key] * bet;
			} else {
				// any two of a kind pays 1x
				if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
					win = bet;
				}
			}
			if (win > 0) {
				message = `Win ${win}!`;
				chips.payout(bet + win);
			} else {
				message = "No win";
			}
			spinning = false;
		}, 700);
	}
</script>

<section class="table-surface p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold" style="color: var(--casino-gold)">Slots</h1>
			<p class="text-emerald-100/80">{message}</p>
		</div>
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2">
				<span>Bet</span>
				<input class="w-24 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" type="number" min="1" bind:value={bet} />
			</label>
			<button class="casino-button" on:click={spin} disabled={spinning}>Spin</button>
		</div>
	</div>

	<div class="casino-panel p-6 mt-6 grid grid-cols-3 gap-4 text-5xl bg-emerald-950/50">
		{#each reels as s}
			<div class="rounded-xl border border-emerald-700 bg-emerald-900/60 grid place-items-center h-24">{s}</div>
		{/each}
	</div>

	<div class="casino-panel p-4 mt-6 text-sm text-emerald-100/80">
		<p class="font-semibold mb-1">Paytable</p>
		<ul class="list-disc pl-5 space-y-0.5">
			<li>7️⃣7️⃣7️⃣ pays 50x</li>
			<li>💎💎💎 pays 20x</li>
			<li>🔔🔔🔔 pays 10x</li>
			<li>⭐⭐⭐ pays 5x</li>
			<li>🍒🍒🍒 pays 3x</li>
			<li>🍋🍋🍋 pays 2x</li>
			<li>Any two of a kind pays 1x</li>
		</ul>
	</div>
</section>