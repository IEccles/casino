<script lang="ts">
	import type { Card } from "$lib/utils/cards";
	export let card: Card;
	$: red = card.suit === "♥" || card.suit === "♦";
	$: black = !red;
</script>

<div class="card-face w-16 h-24 md:w-20 md:h-28 rounded-xl flex flex-col items-center justify-between p-1.5 select-none">
	<div class="text-sm md:text-base font-bold pip" class:pip-red={red} class:pip-black={black}>
		{card.rank}
	</div>
	<div class="text-2xl md:text-3xl pip" class:pip-red={red} class:pip-black={black}>
		{card.suit}
	</div>
	<div class="text-sm md:text-base font-bold pip" class:pip-red={red} class:pip-black={black}>
		{card.rank}
	</div>
</div>

<style>
	.card-face {
		background: radial-gradient(circle at 30% 20%, #ffffff, #f5f5f5);
		border: 2px solid rgba(212,175,55,0.65);
		box-shadow:
			0 6px 18px rgba(0, 0, 0, 0.35),
			0 0 0 1px rgba(255,255,255,0.5) inset,
			0 0 24px rgba(212,175,55,0.2);
	}
	.pip { text-shadow: 0 1px 0 rgba(255,255,255,0.8), 0 0 6px rgba(0,0,0,0.25); }
	.pip-red { color: #ff385c; text-shadow: 0 1px 0 rgba(255,255,255,0.8), 0 0 10px rgba(255,56,92,0.35); }
	.pip-black { color: #1a1a1a; text-shadow: 0 1px 0 rgba(255,255,255,0.8), 0 0 8px rgba(0,0,0,0.35); }
</style>
