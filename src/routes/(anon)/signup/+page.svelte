<script lang="ts">
	import { loadIcons } from '@iconify/svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { sitename } from '$lib/info';
	import { pageTitle } from '$lib/stores.js';
	import AuthForm from '$components/formats/AuthForm.svelte';
	import PageContainer from '$components/formats/PageContainer.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { supabase } = data;

	$pageTitle = `${sitename} - Sign Up`;

	let submitting = false;
	let success: boolean | undefined;

	let email: string | undefined;
	let firstName: string | undefined;
	let lastName: string | undefined;
	let password: string | undefined;
	let accountType: 'user' | 'realtor' | undefined;

	loadIcons(['akar-icons:check']);

	const toast = getToastStore();

	if ($page.data.acct_type) {
		accountType = $page.data.acct_type;
	}

	/**
	 * This function exists purely to just get rid of an issue where
	 * onChange isn't called on autofill.
	 */
	function recheckValues() {
		firstName = (document.getElementById('first-name') as HTMLInputElement).value;
		lastName = (document.getElementById('last-name') as HTMLInputElement).value;
		email = (document.getElementById('email') as HTMLInputElement).value;
		password = (document.getElementById('password') as HTMLInputElement).value;

		let accountTypeValue = (
			document.querySelector('input[name="account_type"]:checked') as HTMLInputElement
		)?.value;
		accountType =
			accountTypeValue === 'user' ? 'user' : accountTypeValue === 'realtor' ? 'realtor' : undefined;
	}

	async function signup() {
		try {
			submitting = true;

			if (!email || !firstName || !lastName || !password || !accountType) {
				recheckValues();
				if (!email || !firstName || !lastName || !password || !accountType) {
					throw new Error('Please fill out all fields.');
				}
			}

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						first_name: firstName,
						last_name: lastName,
						account_type: accountType
					}
				}
			});

			if (error) {
				throw error;
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

	function setFirstName(e: InputElementEvent) {
		firstName = e.currentTarget.value;
	}

	function setLastName(e: InputElementEvent) {
		lastName = e.currentTarget.value;
	}

	function setPassword(e: InputElementEvent) {
		password = e.currentTarget.value;
	}

	function setAccountType(e: InputElementEvent) {
		if (e.currentTarget.value !== 'user' && e.currentTarget.value !== 'realtor') {
			accountType = undefined;
		} else {
			accountType = e.currentTarget.value;
		}
	}
</script>

<PageContainer>
	<AuthForm>
		{#if !success}
			<p class="title">{sitename}</p>
			<!-- Subtitles -->
			{#if accountType === 'user'}
				<p class="subtitle">Sign up and start renting today.</p>
			{:else if accountType === 'realtor'}
				<p class="subtitle">Sign up and start listing today.</p>
			{:else}
				<p class="subtitle">Sign up and start using {sitename} today.</p>
			{/if}

			<!-- Form -->
			<form on:submit|preventDefault={signup} id="signup">
				<div class="form-group">
					<label for="first-name">First name</label>
					<input
						type="text"
						id="first-name"
						on:input={setFirstName}
						bind:value={firstName}
						required
					/>

					<label for="last-name">Last name</label>
					<input type="text" id="last-name" on:input={setLastName} bind:value={lastName} required />
				</div>

				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" on:input={setEmail} bind:value={email} required />

					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						on:input={setPassword}
						bind:value={password}
						required
					/>
				</div>

				<div class="form-group flex-center flex-col">
					<label for="account-type">Are you a renter or a realtor?</label>
					<fieldset id="account-type">
						<input
							type="radio"
							id="user"
							name="account_type"
							value="user"
							checked={accountType === 'user'}
							on:change={setAccountType}
							required
						/>
						<label for="user">Renter</label>

						<input
							type="radio"
							id="realtor"
							name="account_type"
							value="realtor"
							checked={accountType === 'realtor'}
							on:change={setAccountType}
							required
						/>
						<label for="realtor">Realtor</label>
					</fieldset>
				</div>

				<div class="form-group flex-center">
					<button
						type="submit"
						form="signup"
						class="btn-base-orange filled pill min-w-[102px] flex justify-center items-center"
						disabled={submitting}
					>
						{#if submitting}
							<ProgressRadial meter="stroke-gray-50" width="w-6" />
						{:else}
							Register
						{/if}
					</button>
				</div>
			</form>

			<p class="form-footer">
				Already have an account? <a href="/signin" class="text-base-orange">Sign in</a>
			</p>
		{:else}
			<div in:fade class="flex flex-col justify-center items-center gap-6">
				<div class="rounded-full bg-green-500 p-4">
					<Icon icon="akar-icons:check" class="text-6xl text-white" />
				</div>

				<p class="text-lg">Thank you for signing up!</p>

				You're just a few steps away from using {sitename}. Click the button below to explore what
				we have to offer.

				<a
					href={accountType === 'realtor' ? '/realtor' : accountType === 'user' ? '/rent' : '/'}
					class="btn-base-orange filled pill"
				>
					Let's get started
				</a>
			</div>
		{/if}
	</AuthForm>
</PageContainer>
