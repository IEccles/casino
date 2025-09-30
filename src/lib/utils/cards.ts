export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "A" | "K" | "Q" | "J" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

export interface Card {
	suit: Suit;
	rank: Rank;
	value: number; // 2..11 for blackjack convenience (A=11)
}

export const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
export const RANKS: Rank[] = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

export function rankToNumeric(rank: Rank): number {
	switch (rank) {
		case "A":
			return 14;
		case "K":
			return 13;
		case "Q":
			return 12;
		case "J":
			return 11;
		default:
			return parseInt(rank, 10);
	}
}

export function makeDeck(): Card[] {
	const deck: Card[] = [];
	for (const suit of SUITS) {
		for (const rank of RANKS) {
			let value = 0;
			if (rank === "A") value = 11;
			else if (["K", "Q", "J"].includes(rank)) value = 10;
			else value = parseInt(rank, 10);
			deck.push({ suit, rank, value });
		}
	}
	return deck;
}

export function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export function blackjackTotal(cards: Card[]): number {
	let total = 0;
	let aces = 0;
	for (const c of cards) {
		total += c.value;
		if (c.rank === "A") aces++;
	}
	while (total > 21 && aces > 0) {
		total -= 10; // Count Ace as 1 instead of 11
		aces--;
	}
	return total;
}

export function cardColor(suit: Suit): "red" | "black" {
	return suit === "♥" || suit === "♦" ? "red" : "black";
}