<script lang="ts">
	import { chips } from "$lib/stores/chips";

	type BetType = "color" | "parity" | "number";
	let type: BetType = "color";
	let bet = 50;
	let color: "red" | "black" = "red";
	let parity: "even" | "odd" = "even";
	let number = 7;
	let spinning = false;
	let result: { n: number; color: "red" | "black" | "green" } | null = null;
	let message = "Place your bet";

	const reds = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

	function spin() {
		if (spinning) return;
		if (!chips.bet(bet)) {
			message = "Not enough chips";
			return;
		}
		spinning = true;
		message = "Spinning...";
		setTimeout(() => {
			const n = Math.floor(Math.random() * 37);
			let c: "red" | "black" | "green" = "green";
			if (n === 0) c = "green";
			else c = reds.has(n) ? "red" : "black";
			result = { n, color: c };
			const payout = settle();
			if (payout > 0) {
				message = `You win ${payout} chips!`;
				chips.payout(bet + payout); // return stake + winnings
			} else {
				message = "No luck this time.";
			}
			spinning = false;
		}, 900);
	}

	function settle(): number {
		if (!result) return 0;
		if (type === "color") {
			if (result.color === color) return bet; // 1:1
			return 0;
		}
		if (type === "parity") {
			if (result.n === 0) return 0;
			const isEven = result.n % 2 === 0;
			if ((parity === "even" && isEven) || (parity === "odd" && !isEven)) return bet; // 1:1
			return 0;
		}
		// number
		if (result.n === number) return bet * 35; // 35:1
		return 0;
	}
</script>

<section class="table-surface p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold" style="color: var(--casino-gold)">Roulette</h1>
			<p class="text-emerald-100/80">{message}</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<label class="flex items-center gap-2">
				<span>Bet</span>
				<input class="w-24 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" type="number" min="1" bind:value={bet} />
			</label>
			<select class="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" bind:value={type}>
				<option value="color">Color</option>
				<option value="parity">Odd/Even</option>
				<option value="number">Number</option>
			</select>
			{#if type === 'color'}
				<select class="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" bind:value={color}>
					<option value="red">Red</option>
					<option value="black">Black</option>
				</select>
			{:else if type === 'parity'}
				<select class="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" bind:value={parity}>
					<option value="even">Even</option>
					<option value="odd">Odd</option>
				</select>
			{:else}
				<input class="w-24 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" type="number" min="0" max="36" bind:value={number} />
			{/if}
			<button class="casino-button" on:click={spin} disabled={spinning}>Spin</button>
		</div>
	</div>

	{#if result}
		<div class="casino-panel p-6 mt-6 flex items-center gap-4">
			<div class="w-24 h-24 rounded-full grid place-items-center text-3xl font-bold border-4"
				style="background: radial-gradient(circle, #0e3, #0a3); border-color: {result.color === 'red' ? '#b22222' : result.color === 'black' ? '#222' : '#0a3'}; color: {result.color === 'red' ? '#b22222' : result.color === 'black' ? '#ddd' : '#0f0'};">
				{result.n}
			</div>
			<div>
				<p>Result: <strong class="uppercase">{result.color}</strong> {result.n}</p>
				<p class="text-sm text-emerald-200/80">Color pays 1:1, Odd/Even pays 1:1, Number pays 35:1</p>
			</div>
		</div>
	{/if}
</section>