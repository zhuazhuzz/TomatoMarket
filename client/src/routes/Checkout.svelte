<script>
    import { CheckoutStore } from "./stores";
    import { onMount } from "svelte";
    import { toast } from '@zerodevx/svelte-toast'

    let checkoutItems = []
    $: grandTotal = checkoutItems.reduce((total, item) => total + (item.totalPrice), 0)

    async function purchaseNow() {
        toast.push('Order Placed!')
        const res = await fetch(`http://localhost:4001/removeall`, {
            method: 'DELETE'
        });
    }

    async function trashCheckoutItem(id) {
        const res = await fetch(`http://localhost:4001/checkout/${id}`, {
            method: 'DELETE'
        });
        await reload()
    }

    onMount(async () => {
        await reload()
    });

    async function reload() {
        const res = await fetch('http://localhost:4001/checkout');
        const data = await res.json();
        CheckoutStore.set(data);
    }

    CheckoutStore.subscribe((_checkoutItems) => {
        checkoutItems = _checkoutItems
    });
</script>

<div class="checkout-container">
    <div class="items-list">
        {#each checkoutItems as item}
            <div class="checkout-card">
                <div class="left-section">
                    <img class="item-image" src={atob(item.image)} alt={item.name} />
                    <div class="item-name">{item.name}</div>
                </div>
                <div class="right-section">
                    <div class="price-qty-container">
                        <div class="item-price">${(parseFloat(item.totalPrice)).toFixed(2)}</div>
                        <div class="item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <button class="remove-button" on:click={() => trashCheckoutItem(item.id)}>🗑️</button>
                </div>
            </div>
        {/each}
    </div>

    <div class="checkout-summary">
        <div class="grand-total">Order Total: ${grandTotal.toFixed(2)}</div>
        <button class="purchase-button" on:click={purchaseNow}>Purchase Now</button>
    </div>
</div>

<style>
    .checkout-container {
        display: flex;
        justify-content: space-between;
        padding: 16px;
    }

    .items-list {
        flex: 3;
        margin-right: 32px;
    }

    .checkout-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .left-section {
        display: flex;
        align-items: center;
    }

    .item-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 16px;
    }

    .item-name {
        font-size: 18px;
        font-weight: 500;
    }

    .right-section {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .price-qty-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .item-price {
        font-size: 18px;
        color: #333;
    }

    .item-quantity {
        font-size: 16px;
        color: #666;
    }

    .remove-button {
        background-color: transparent;
        border: none;
        color: #dc3545;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        transition: color 0.3s ease;
    }

    .remove-button:hover {
        color: #c82333;
    }

    .checkout-summary {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .grand-total {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 32px;
    }

    .purchase-button {
        padding: 12px 24px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .purchase-button:hover {
        background-color: #218838;
    }
</style>