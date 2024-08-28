<script>
    import Listings from "./Listings.svelte";
    import { ListingStore } from "./stores";
    import { toast } from '@zerodevx/svelte-toast'

    let goBackListings = false;
  
    let name = '';
    let image = '';
    let price = 0;

    async function addListingToDB() {
        if(name === '' || image === '' || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            toast.push("Include a proper name & image, and no negative prices!")
        } else {
            goBackListings = !goBackListings;
            const res = await fetch("http://localhost:4000/listing", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image, price }),
            });
            const resList = await fetch('http://localhost:4000/listing');
            const dataList = await resList.json();
            ListingStore.set(dataList);
    
            name = '';
            image = '';
            price = 0;
        }
    }
</script>

{#if goBackListings}
    <Listings/>
{:else}
    <div class="form-container">
        <div class="form-group">
            <label for="name">Item Name</label>
            <input type="text" id="name" bind:value={name} class="form-control" placeholder="Enter item name">
        </div>

        <div class="form-group">
            <label for="image">Image Link</label>
            <input type="text" id="image" bind:value={image} class="form-control" placeholder="Enter image link">
        </div>

        <div class="form-group">
            <label for="price">Price</label>
            <input type="text" id="price" bind:value={price} class="form-control" placeholder="Enter price">
        </div>

        <button class="btn btn-primary" on:click={addListingToDB}>Submit</button>
    </div>
{/if}

<style>
    .form-container {
        margin-top: 50px;
        max-width: 600px;
        margin: 50px auto;
        padding: 30px;
        border: 2px solid #ddd;
        border-radius: 10px;
        background-color: #f5f5f5;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        margin-bottom: 8px;
        display: block;
        font-size: 1.1em;
    }

    .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
        font-size: 1em;
    }

    .btn {
        display: block;
        width: 100%;
        padding: 12px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        box-sizing: border-box;
        font-size: 1.1em;
        transition: background-color 0.3s ease;
    }

    .btn:hover {
        background-color: #0056b3;
    }
</style>
