<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { sitename } from '$lib/info';
	import { pageTitle } from '$lib/stores.js';
	import AuthForm from '$components/formats/AuthForm.svelte';

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

  async function signup() {

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
    if(e.currentTarget.value !== 'user' && e.currentTarget.value !== 'realtor') {
      accountType = undefined;
    } else {
      accountType = e.currentTarget.value;
    }
  }
</script>

<AuthForm>
</AuthForm>

<style lang="postcss">
</style>
