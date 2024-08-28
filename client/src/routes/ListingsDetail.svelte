<script>
    import { onMount } from "svelte";
    import Reviews from './Reviews.svelte';
    import { toast } from '@zerodevx/svelte-toast';
	import Listings from "./Listings.svelte";

    export let product = {};  
    let qty = 1;
    let goBackListing = false;
    
    async function addToCart(product) {
        toast.push(`${qty} ${product.name} was added to Cart`)
        const res = await fetch("http://localhost:4001/checkout", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: product.id, name: product.name, image: (product.image), totalPrice: product.price, quantity: qty }),
        });
    }

    onMount(async () => {

    });

    function goBack() {
        goBackListing = !goBackListing
    }

</script>

{#if goBackListing}
    <Listings />
{:else}
    <div class="product-detail-container">
        <button class="back-button" on:click={goBack}>← Back to Products</button>

        <div class="product-header">
            <h1>{product.name}</h1>
        </div>

        <div class="product-main">
            <img class="product-image" src={atob(product.image)} alt={product.name} />
            <div class="product-info">
                <div class="product-price">${(parseFloat(product.price)).toFixed(2)}</div>
                <div class="quantity-control">
                    <label for="quantity">Qty:</label>
                    <select bind:value={qty} class="quantity-dropdown">
                        {#each Array(10) as _, i}
                            <option value={i + 1}>{i + 1}</option>
                        {/each}
                    </select>
                </div>
                <button class="add-to-cart-button" on:click={() =>{addToCart(product)}}>Add to Cart</button>
            </div>
        </div>
        <div class="reviews-section">
            <Reviews {product}/>
        </div>
    </div>
{/if}



<style>
    .product-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
    }

    .back-button {
        cursor: pointer;
        color: #007bff;
        font-size: 18px;
        margin-bottom: 16px;
        border-radius: 10px;
    }

    .back-button:hover {
        text-decoration: underline;
    }

    .product-header {
        text-align: center;
        margin-bottom: 24px;
    }

    .product-header h1 {
        font-size: 36px;
        font-weight: 700;
    }

    .product-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .product-image {
        max-width: 500px;
        max-height: 500px;
        object-fit: cover;
        border-radius: 16px;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .product-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 32px;
    }

    .product-price {
        font-size: 28px;
        color: #333;
        margin-bottom: 16px;
    }

    .quantity-control {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
    }

    .quantity-control label {
        font-size: 18px;
        margin-right: 12px;
    }

    .quantity-dropdown {
        padding: 8px;
        background-color: #ddd;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        height: 40px;
        width: 100%;
        cursor: pointer;
    }

    .add-to-cart-button {
        padding: 16px 32px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .add-to-cart-button:hover {
        background-color: #218838;
    }

    .reviews-section {
        margin-top: 48px;
    }
</style>