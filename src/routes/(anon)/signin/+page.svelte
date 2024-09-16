<script lang="ts">
	import { loadIcons } from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { sitename } from '$lib/info';
	import { pageTitle } from '$lib/stores.js';
	import AuthForm from '$components/formats/AuthForm.svelte';
	import PageContainer from '$components/formats/PageContainer.svelte';
	import { goto } from '$app/navigation';

	export let data;
	const { supabase } = data;

	$pageTitle = `${sitename} - Sign In`;

	let submitting = false;
	let success: boolean | undefined;

	let email: string | undefined;
	let password: string | undefined;

	let accountType: 'user' | 'realtor' | undefined;

	loadIcons(['akar-icons:check']);

	const toast = getToastStore();

	/**
	 * This function exists purely to just get rid of an issue where
	 * onChange isn't called on autofill.
	 */
	function recheckValues() {
		email = (document.getElementById('email') as HTMLInputElement).value;
		password = (document.getElementById('password') as HTMLInputElement).value;
	}

	async function signin() {
		try {
			submitting = true;

			if (!email || !password) {
				recheckValues();
				if (!email || !password) {
					throw new Error('Please fill out all fields.');
				}
			}

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				throw error;
			}

			accountType = data.user.user_metadata.account_type;

			if (data.user.user_metadata.account_type === 'realtor') {
				accountType = 'realtor';
				goto('/realtor');
			} else if (data.user.user_metadata.account_type === 'user') {
				accountType = 'user';
				goto('/user');
			} else {
				accountType = undefined;
				goto('/');
			}

			success = true;
		} catch (error) {
			if (error instanceof Error) {
				toast.trigger({
					message: error.message,
					timeout: 2000,
					background: 'variant-filled-warning'
				});
			}
			success = false;
		} finally {
			submitting = false;
		}
	}

	function setEmail(e: InputElementEvent) {
		email = e.currentTarget.value;
	}

	function setPassword(e: InputElementEvent) {
		password = e.currentTarget.value;
	}
</script>

<PageContainer>
	<AuthForm>
		{#if !success}
			<p class="title">{sitename}</p>
			<p class="subtitle">Welcome back. We missed you!</p>

			<!-- Form -->
			<form on:submit|preventDefault={signin} id="signin">
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" on:input={setEmail} bind:value={email} required />

					<label for="password">Password</label>
					<input type="password" id="password" on:input={setPassword} bind:value={password} required />
				</div>

				<div class="form-group flex-center">
					<button
						type="submit"
						form="signin"
						class="btn-base-orange filled pill min-w-[102px] flex justify-center items-center"
						disabled={submitting}
					>
						{#if submitting}
							<ProgressRadial meter="stroke-gray-50" width="w-6" />
						{:else}
							Login
						{/if}
					</button>
				</div>
			</form>

			<p class="form-footer">Don't have an account? <a href="/signup">Sign up</a></p>
		{:else}
			<div in:fade class="flex flex-col justify-center items-center gap-6">
				<div class="rounded-full bg-green-500 p-4">
					<Icon icon="akar-icons:check" class="text-6xl text-white" />
				</div>

				<p class="text-lg">You're logged in!</p>

				We're redirecting you now. If you're not redirected in 5 seconds, click the button below.

				<a
					href={accountType === 'realtor' ? '/realtor' : accountType === 'user' ? '/user' : '/'}
					class="btn-base-orange filled pill"
				>
					Let's get started
				</a>
			</div>
		{/if}
	</AuthForm>
</PageContainer>
