<script>
    import AddListing from './AddListing.svelte';
    import { ListingStore } from './stores'
    import { onMount } from 'svelte';
    import { toast } from '@zerodevx/svelte-toast'
    import ListingsDetail from './ListingsDetail.svelte';

    let showAddListing = false;
    let showProductDetail = false;
    let product = null;

    let listings = []
    let quantities = {};

    function toggleView() {
        showAddListing = !showAddListing;
    }
    function toggleProductView(item) {
        showProductDetail = !showProductDetail;
        product = item
    }

    async function addToCart(product) {
        toast.push(`${quantities[product.id]} ${product.name} was added to Cart`)
        const res = await fetch("http://localhost:4001/checkout", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: product.id, name: product.name, image: (product.image), totalPrice: product.price, quantity: quantities[product.id] }),
        });
    }

    onMount(async () => {
        await reload()
    });

    async function deleteProduct(product) {
        const res = await fetch(`http://localhost:4000/listing/${product.id}`, {
            method: 'DELETE'
        });
        await reload()
    }

    async function reload() {
        const res = await fetch('http://localhost:4000/listing');
        const data = await res.json();
        ListingStore.set(data);
    }
    
    ListingStore.subscribe((_listings) => {
        listings = _listings
    });

</script>


{#if showAddListing}
    <AddListing />
{:else if showProductDetail}
    <ListingsDetail {product}/>
{:else }
    <div class="grid-container">
        <div class="card add-button-card">
            <button class="add-button" on:click={toggleView}> ➕ Add Product</button>
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#each listings as product (product.id)}
            <div class="card">
                <button class="delete-button" on:click={async () => await deleteProduct(product)}>🗑️</button>
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img class="card-img" on:click={() => toggleProductView(product)} src={atob(product.image)} alt={product.name} />
                <div class="card-body">
                    <div class="info-section">
                        <div class="card-title">{product.name}</div>
                        <div class="card-price">${(parseFloat(product.price)).toFixed(2)}</div>
                    </div>
                    <div class="cart-section">
                        <button class="add-to-cart-button" on:click={async () => await addToCart(product)}>🛒 Add to Cart</button>
                        <select bind:value={quantities[product.id]} class="quantity-dropdown">
                            {#each Array(10) as _, i}
                                <option value={i + 1}>{i + 1}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    :global(body) {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding: 16px;
    }

    .add-button-card {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .add-button {
        padding: 20px;
        background-color: #f1f1f1;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        color: #333;
        cursor: pointer;
        text-align: center;
        width: 100%;
        height: 100%;
        transition: background-color 0.3s, box-shadow 0.3s;
    }

    .card {
        position: relative;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        background-color: #fff;
        transition: box-shadow 0.3s ease;
    }

    .card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .card-img {
        width: 100%;
        height: 215px;
        object-fit: cover;
    }

    .delete-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: transparent;
        color: white;
        border: none;
        border-radius: 20%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .delete-button:hover {
        background-color: rgb(245, 9, 9);
    }

    .card-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
    }

    .info-section {
        text-align: left;
    }

    .card-title {
        font-size: 1.25em;
        margin-bottom: 8px;
    }

    .card-price {
        font-size: 1.1em;
        color: #333;
    }

    .cart-section {
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    .add-to-cart-button {
        padding: 8px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 8px;
        height: 40px;
        width: 100%;
    }

    .add-to-cart-button:hover {
        background-color: #218838;
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
</style>
  