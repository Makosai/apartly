import { writable } from 'svelte/store';
import { sitename } from './info';

export const pageTitle = writable(`${sitename}`);
