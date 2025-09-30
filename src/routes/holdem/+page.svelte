<script lang="ts">
	import { chips } from "$lib/stores/chips";
	import { makeDeck, shuffle, type Card } from "$lib/utils/cards";
	import CardView from "$lib/components/Card.svelte";
	import { evaluate7, compareEval } from "$lib/utils/poker";

	let deck: Card[] = [];
	let player: Card[] = [];
	let dealer: Card[] = [];
	let board: Card[] = [];
	let bet = 100;
	let message = "Place your bet and play a hand";
	let inHand = false;
	let revealed = false;

	function newDeck() {
		deck = shuffle(makeDeck());
	}

	function deal() {
		if (inHand) return;
		if (!chips.bet(bet)) {
			message = "Not enough chips";
			return;
		}
		if (deck.length < 15) newDeck();
		player = [deck.pop()!, deck.pop()!];
		dealer = [deck.pop()!, deck.pop()!];
		board = [deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!];
		inHand = true;
		revealed = false;
		message = "Click Showdown to reveal and settle";
	}

	function showdown() {
		if (!inHand) return;
		revealed = true;
		const pe = evaluate7([...player, ...board]);
		const de = evaluate7([...dealer, ...board]);
		const cmp = compareEval(pe, de);
		if (cmp > 0) {
			message = `You win (${pe.name})`;
			chips.payout(bet * 2);
		} else if (cmp < 0) {
			message = `Dealer wins (${de.name})`;
		} else {
			message = `Push (${pe.name})`;
			chips.payout(bet);
		}
		inHand = false;
	}

	newDeck();
</script>

<section class="table-surface p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold" style="color: var(--casino-gold)">Texas Hold'em (Heads-up)</h1>
			<p class="text-emerald-100/80">{message}</p>
		</div>
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2">
				<span>Bet</span>
				<input class="w-24 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" type="number" min="1" bind:value={bet} />
			</label>
			<button class="casino-button" on:click={deal} disabled={inHand}>Deal</button>
			<button class="casino-button" on:click={showdown} disabled={!inHand}>Showdown</button>
		</div>
	</div>

	<div class="grid md:grid-cols-2 gap-6 mt-6">
		<div class="casino-panel p-4">
			<h2 class="font-semibold mb-2">Dealer {#if revealed}hand{/if}</h2>
			<div class="flex gap-2">
				{#each dealer as c}
					{#if revealed}
						<CardView {card}={c} />
					{:else}
						<div class="w-14 h-20 rounded-lg bg-emerald-900/70 border border-emerald-700" />
					{/if}
				{/each}
			</div>
		</div>
		<div class="casino-panel p-4">
			<h2 class="font-semibold mb-2">Player</h2>
			<div class="flex gap-2">
				{#each player as c}
					<CardView {card}={c} />
				{/each}
			</div>
		</div>
	</div>

	<div class="casino-panel p-4 mt-6">
		<h2 class="font-semibold mb-2">Board</h2>
		<div class="flex gap-2">
			{#each board as c}
				<CardView {card}={c} />
			{/each}
		</div>
	</div>
</section>