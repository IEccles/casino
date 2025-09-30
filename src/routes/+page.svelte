<script lang="ts">
	import { chips } from "$lib/stores/chips";
</script>

<section class="casino-panel p-6">
	<h1 class="text-3xl font-extrabold mb-2" style="color: var(--casino-gold)">Welcome to the Grand Royale</h1>
	<p class="text-emerald-100/90">A classy casino experience in your browser. Choose a game below. Your chips are stored locally on this device.</p>
</section>

<div class="grid md:grid-cols-2 gap-6 mt-6">
	<a href="/blackjack" class="casino-panel p-6 hover:ring-2 ring-emerald-400 transition">
		<h2 class="text-2xl font-bold mb-2">Blackjack</h2>
		<p class="text-emerald-100/80">Beat the dealer. Aces high or low.</p>
	</a>
	<a href="/roulette" class="casino-panel p-6 hover:ring-2 ring-emerald-400 transition">
		<h2 class="text-2xl font-bold mb-2">Roulette</h2>
		<p class="text-emerald-100/80">Red or black? Odd or even? Pick your number.</p>
	</a>
	<a href="/holdem" class="casino-panel p-6 hover:ring-2 ring-emerald-400 transition">
		<h2 class="text-2xl font-bold mb-2">Texas Hold'em</h2>
		<p class="text-emerald-100/80">Heads-up showdown. Best five-card hand wins.</p>
	</a>
	<a href="/slots" class="casino-panel p-6 hover:ring-2 ring-emerald-400 transition">
		<h2 class="text-2xl font-bold mb-2">Slot Machines</h2>
		<p class="text-emerald-100/80">Spin and win with classic symbols.</p>
	</a>
	<a href="/horses" class="casino-panel p-6 hover:ring-2 ring-emerald-400 transition md:col-span-2">
		<h2 class="text-2xl font-bold mb-2">Horse Racing</h2>
		<p class="text-emerald-100/80">Bet on your favorite and watch the race.</p>
	</a>
</div>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
