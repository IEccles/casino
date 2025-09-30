<script lang="ts">
	import { onMount } from "svelte";
	import { chips } from "$lib/stores/chips";
	import { makeDeck, shuffle, blackjackTotal, type Card } from "$lib/utils/cards";
	import CardView from "$lib/components/Card.svelte";

	let deck: Card[] = [];
	let player: Card[] = [];
	let dealer: Card[] = [];
	let bet = 50;
	let message = "Place your bet and deal";
	let inRound = false;
	let revealDealer = false;

	function resetDeck() {
		deck = shuffle(makeDeck());
	}

	function deal() {
		if (inRound) return;
		if (!chips.bet(bet)) {
			message = "Not enough chips";
			return;
		}
		if (deck.length < 15) resetDeck();
		player = [deck.pop()!, deck.pop()!];
		dealer = [deck.pop()!, deck.pop()!];
		inRound = true;
		revealDealer = false;
		message = "Hit or Stand";
	}

	function hit() {
		if (!inRound) return;
		player = [...player, deck.pop()!];
		const total = blackjackTotal(player);
		if (total > 21) {
			endRound();
		}
	}

	function stand() {
		if (!inRound) return;
		revealDealer = true;
		// Dealer hits to 17+
		while (blackjackTotal(dealer) < 17) {
			dealer = [...dealer, deck.pop()!];
		}
		endRound();
	}

	function endRound() {
		revealDealer = true;
		inRound = false;
		const p = blackjackTotal(player);
		const d = blackjackTotal(dealer);
		const playerBJ = p === 21 && player.length === 2;
		const dealerBJ = d === 21 && dealer.length === 2;

		if (p > 21) {
			message = "Bust! You lose.";
			return;
		}
		if (d > 21) {
			message = "Dealer busts! You win.";
			chips.payout(bet * 2);
			return;
		}
		if (playerBJ && !dealerBJ) {
			message = "Blackjack! Payout 3:2";
			chips.payout(Math.floor(bet * 2.5));
			return;
		}
		if (dealerBJ && !playerBJ) {
			message = "Dealer has Blackjack. You lose.";
			return;
		}
		if (p > d) {
			message = "You win!";
			chips.payout(bet * 2);
		} else if (p < d) {
			message = "You lose.";
		} else {
			message = "Push. Bet returned.";
			chips.payout(bet);
		}
	}

	onMount(resetDeck);
</script>

<section class="table-surface p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold" style="color: var(--casino-gold)">Blackjack</h1>
			<p class="text-emerald-100/80">{message}</p>
		</div>
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2">
				<span>Bet</span>
				<input class="w-24 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700" type="number" min="1" bind:value={bet} />
			</label>
			<button class="casino-button" on:click={deal} disabled={inRound}>Deal</button>
			<button class="casino-button" on:click={hit} disabled={!inRound}>Hit</button>
			<button class="casino-button" on:click={stand} disabled={!inRound}>Stand</button>
		</div>
	</div>

	<div class="grid md:grid-cols-2 gap-6 mt-6">
		<div class="casino-panel p-4">
			<h2 class="font-semibold mb-2">Dealer {revealDealer ? `(total ${blackjackTotal(dealer)})` : ""}</h2>
			<div class="flex gap-2">
				{#each dealer as c, i}
					{#if i === 1 && !revealDealer}
						<div class="w-14 h-20 rounded-lg bg-emerald-900/70 border border-emerald-700"></div>
					{:else}
						<CardView card={c} />
					{/if}
				{/each}
			</div>
		</div>
		<div class="casino-panel p-4">
			<h2 class="font-semibold mb-2">Player (total {blackjackTotal(player)})</h2>
			<div class="flex gap-2">
				{#each player as c}
					<CardView card={c} />
				{/each}
			</div>
		</div>
	</div>
</section>