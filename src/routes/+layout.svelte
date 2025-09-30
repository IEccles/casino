<script lang="ts">
	import "../app.css";
	import { chips, resetChips } from "$lib/stores/chips";
	import { page } from "$app/stores";
</script>

<nav class="sticky top-0 z-40 border-b border-emerald-800/70 bg-emerald-900/80 backdrop-blur">
	<div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
		<a href="/" class="flex items-center gap-3">
			<div class="h-8 w-8 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow" />
			<div class="text-xl font-bold tracking-wide" style="color: var(--casino-gold)">Grand Royale Casino</div>
		</a>
		<div class="flex items-center gap-1">
			<a class="nav-link" class:active={$page.url.pathname === "/blackjack"} href="/blackjack">Blackjack</a>
			<a class="nav-link" class:active={$page.url.pathname === "/roulette"} href="/roulette">Roulette</a>
			<a class="nav-link" class:active={$page.url.pathname === "/holdem"} href="/holdem">Texas Hold'em</a>
			<a class="nav-link" class:active={$page.url.pathname === "/slots"} href="/slots">Slots</a>
			<a class="nav-link" class:active={$page.url.pathname === "/horses"} href="/horses">Horse Racing</a>
		</div>
		<div class="flex items-center gap-3">
			<div class="badge" title="Your chip balance">
				<span>🎲 Chips</span>
				<strong class="tabular-nums">{$chips.toLocaleString()}</strong>
			</div>
			<button class="casino-button" on:click={resetChips} title="Reset to starting stack">Reset</button>
		</div>
	</div>
</nav>

<main class="mx-auto max-w-6xl px-4 py-6">
	<slot />
</main>
