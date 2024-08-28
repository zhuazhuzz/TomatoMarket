<script>
    import TomatoMarketLogo from '../tomatomarketcrop.jpg'
	import Listings from './Listings.svelte';
    import Checkout from './Checkout.svelte';
    import { SvelteToast } from '@zerodevx/svelte-toast'

    let currentPage = 'listings';

    function navigate(page) {
        currentPage = page;
    }
</script>

<SvelteToast />

<nav class="navbar">
    <div class="logo">
        <img src={TomatoMarketLogo} alt="TomatoMarket Logo">
    </div>
    <div class="navbutton"> 
        <button class="nav-link {currentPage === 'listings' ? 'active' : ''}" on:click={() => { navigate('listings')}}> Products </button>
        <button class="nav-link {currentPage === 'checkout' ? 'active' : ''}" on:click={() => navigate('checkout')}> Checkout </button>
    </div>
</nav>

{#if currentPage === 'listings'}
    <Listings />
{:else if currentPage === 'checkout'}
    <Checkout />
{/if}

<style>
    :global(body) {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
    }

    .logo img {
        height: 65px;
        border-radius: 0.5rem;
    }

    .navbutton {
        display: flex;
    }

    button.nav-link {
        padding: 1rem 2rem;
        cursor: pointer;
        background-color: transparent;
        border: 2px solid transparent;
        border-radius: 0.5rem;
        font-size: 1.25rem;
        color: #000000;
        margin-left: 1rem;
        transition: background-color 0.2s, color 0.2s;
    }

    button.nav-link.active {
        background-color: #fb731f;
        color: white;
        border-color: #fb731f;
    }
</style>