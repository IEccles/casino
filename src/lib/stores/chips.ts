import { browser } from "$app/environment";
import { writable } from "svelte/store";

const STARTING_STACK = 1000;

function createChipsStore() {
	let initial = STARTING_STACK;
	if (browser) {
		try {
			const raw = localStorage.getItem("casino:chips");
			if (raw) initial = JSON.parse(raw);
		} catch {}
	}
	const { subscribe, set, update } = writable<number>(initial);

	function persist(value: number) {
		if (browser) {
			try {
				localStorage.setItem("casino:chips", JSON.stringify(value));
			} catch {}
		}
	}

	return {
		subscribe,
		reset() {
			persist(STARTING_STACK);
			set(STARTING_STACK);
		},
		add(amount: number) {
			update((v) => {
				const next = v + Math.max(0, Math.floor(amount));
				persist(next);
				return next;
			});
		},
		remove(amount: number) {
			update((v) => {
				const next = Math.max(0, v - Math.max(0, Math.floor(amount)));
				persist(next);
				return next;
			});
		},
		bet(amount: number) {
			amount = Math.max(1, Math.floor(amount));
			let ok = false;
			update((v) => {
				if (v >= amount) {
					ok = true;
					const next = v - amount;
					persist(next);
					return next;
				}
				return v;
			});
			return ok;
		},
		payout(amount: number) {
			amount = Math.max(0, Math.floor(amount));
			update((v) => {
				const next = v + amount;
				persist(next);
				return next;
			});
		}
	};
}

export const chips = createChipsStore();
export const resetChips = () => chips.reset();