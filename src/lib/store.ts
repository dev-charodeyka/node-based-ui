import { writable } from 'svelte/store';

export const edgesSore = writable<Edge[]>([]);
export const dataVertexStore = writable<boolean>(false);
export const outputOrTypeStore = writable<string>('type');
