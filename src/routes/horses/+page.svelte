<script lang="ts">
	import { chips } from "$lib/stores/chips";
	let bet = 50;
	let selected = 1;
	let running = false;
	let finished: number | null = null;
	let positions = [0, 0, 0, 0, 0, 0];
	let names = ["Thunder", "Blaze", "Comet", "Majesty", "Shadow", "Rocket"];
	let message = "Pick a horse and start the race";
	let trackLen = 100; // percent
	let interval: any;

	function startRace() {
		if (running) return;
		if (!chips.bet(bet)) {
			message = "Not enough chips";
			return;
		}
		positions = [0, 0, 0, 0, 0, 0];
		finished = null;
		running = true;
		message = "And they're off!";
		interval = setInterval(() => {
			positions = positions.map((p, i) => p + Math.random() * 6 + (Math.random() < 0.1 ? 6 : 0));
			let winner = positions.findIndex((p) => p >= trackLen);
			if (winner !== -1) {
				clearInterval(interval);
				running = false;
				finished = winner;
				if (winner + 1 === selected) {
					const win = bet * 5; // 5:1 payout
					chips.payout(bet + win);
					message = `Winner: ${names[winner]}! You win ${win}.`;
				} else {
					message = `Winner: ${names[winner]}. Better luck next time.`;
				}
			}
		}, 100);
	}
</script>

<section class="table-surface p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold" style="color: var(--casino-gold)">Horse Racing</h1>
			<p class="text-emerald-100/80">{message}</p>
		</div>
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2">
				<span>Bet</span>
				<input class="w-24 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" type="number" min="1" bind:value={bet} />
			</label>
			<select class="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" bind:value={selected}>
				{#each names as n, i}
					<option value={i + 1}>{i + 1}. {n}</option>
				{/each}
			</select>
			<button class="casino-button" on:click={startRace} disabled={running}>Start Race</button>
		</div>
	</div>

	<div class="casino-panel p-6 mt-6 space-y-4">
		{#each names as n, i}
			<div class="space-y-1">
				<div class="flex items-center justify-between text-sm text-emerald-100/80">
					<span>#{i + 1} {n}</span>
					<span>{Math.min(100, Math.floor(positions[i]))}%</span>
				</div>
				<div class="h-3 w-full bg-emerald-950/60 rounded-full border border-emerald-800 overflow-hidden">
					<div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={`width: ${Math.min(100, positions[i])}%`}></div>
				</div>
			</div>
		{/each}
	</div>
</section>