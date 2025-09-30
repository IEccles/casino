import type { Card } from "$lib/utils/cards";
import { rankToNumeric } from "$lib/utils/cards";

export type HandRankName =
	| "high"
	| "pair"
	| "two-pair"
	| "trips"
	| "straight"
	| "flush"
	| "full-house"
	| "quads"
	| "straight-flush";

export interface EvaluatedHand {
	name: HandRankName;
	score: number[]; // for tie-breaking, lexicographically compared
}

function countsByRank(cards: Card[]): Map<number, number> {
	const m = new Map<number, number>();
	for (const c of cards) {
		const r = rankToNumeric(c.rank);
		m.set(r, (m.get(r) ?? 0) + 1);
	}
	return m;
}

function groupBySuit(cards: Card[]): Map<string, Card[]> {
	const m = new Map<string, Card[]>();
	for (const c of cards) {
		m.set(c.suit, [...(m.get(c.suit) ?? []), c]);
	}
	return m;
}

function getStraight(highs: number[]): number | null {
	// highs: sorted descending unique ranks
	const uniq = Array.from(new Set(highs)).sort((a, b) => b - a);
	// handle wheel: A(14),5,4,3,2
	if (uniq.includes(14) && uniq.includes(5) && uniq.includes(4) && uniq.includes(3) && uniq.includes(2)) {
		return 5; // 5-high straight
	}
	let run = 1;
	for (let i = 0; i < uniq.length - 1; i++) {
		if (uniq[i] - 1 === uniq[i + 1]) run++;
		else run = 1;
		if (run >= 5) {
			return uniq[i - 3]; // current is i, start is i-3, high card is start+4 which equals uniq[i-3]
		}
	}
	return null;
}

export function evaluate7(cards: Card[]): EvaluatedHand {
	if (cards.length < 5) throw new Error("Need at least 5 cards");
	const ranks = cards.map((c) => rankToNumeric(c.rank)).sort((a, b) => b - a);
	const byRank = countsByRank(cards);
	const bySuit = groupBySuit(cards);

	// Flush (and straight flush)
	let flushSuit: string | null = null;
	for (const [s, arr] of bySuit) {
		if (arr.length >= 5) {
			flushSuit = s;
			break;
		}
	}
	if (flushSuit) {
		const flushCards = cards.filter((c) => c.suit === flushSuit);
		const flushRanks = flushCards.map((c) => rankToNumeric(c.rank)).sort((a, b) => b - a);
		const sfHigh = getStraight(flushRanks);
		if (sfHigh) {
			return { name: "straight-flush", score: [8, sfHigh] };
		}
	}

	// Quads
	for (const [r, cnt] of Array.from(byRank.entries()).sort((a, b) => b[0] - a[0])) {
		if (cnt === 4) {
			const kickers = ranks.filter((x) => x !== r);
			return { name: "quads", score: [7, r, kickers[0]] };
		}
	}

	// Full house
	const tripsRanks = Array.from(byRank.entries())
		.filter(([, c]) => c === 3)
		.map(([r]) => r)
		.sort((a, b) => b - a);
	const pairRanks = Array.from(byRank.entries())
		.filter(([r, c]) => c >= 2 && !tripsRanks.includes(r))
		.map(([r]) => r)
		.sort((a, b) => b - a);
	if (tripsRanks.length >= 2) {
		return { name: "full-house", score: [6, tripsRanks[0], tripsRanks[1]] };
	}
	if (tripsRanks.length >= 1 && pairRanks.length >= 1) {
		return { name: "full-house", score: [6, tripsRanks[0], pairRanks[0]] };
	}

	// Flush
	if (flushSuit) {
		const flushRanks = cards
			.filter((c) => c.suit === flushSuit)
			.map((c) => rankToNumeric(c.rank))
			.sort((a, b) => b - a);
		return { name: "flush", score: [5, ...flushRanks.slice(0, 5)] };
	}

	// Straight
	const straightHigh = getStraight(ranks);
	if (straightHigh) {
		return { name: "straight", score: [4, straightHigh] };
	}

	// Trips
	if (tripsRanks.length >= 1) {
		const kickers = ranks.filter((r) => r !== tripsRanks[0]);
		return { name: "trips", score: [3, tripsRanks[0], kickers[0], kickers[1]] };
	}

	// Two pair
	const pairs = Array.from(byRank.entries())
		.filter(([, c]) => c === 2)
		.map(([r]) => r)
		.sort((a, b) => b - a);
	if (pairs.length >= 2) {
		const kicker = ranks.find((r) => r !== pairs[0] && r !== pairs[1])!;
		return { name: "two-pair", score: [2, pairs[0], pairs[1], kicker] };
	}

	// One pair
	if (pairs.length === 1) {
		const kickers = ranks.filter((r) => r !== pairs[0]);
		return { name: "pair", score: [1, pairs[0], kickers[0], kickers[1], kickers[2]] };
	}

	// High card
	return { name: "high", score: [0, ...ranks.slice(0, 5)] };
}

export function compareEval(a: EvaluatedHand, b: EvaluatedHand): number {
	const len = Math.max(a.score.length, b.score.length);
	for (let i = 0; i < len; i++) {
		const va = a.score[i] ?? 0;
		const vb = b.score[i] ?? 0;
		if (va !== vb) return va - vb;
	}
	return 0;
}