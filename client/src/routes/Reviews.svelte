<script>
    import { ReviewStore } from './stores'
    import { onMount } from 'svelte';
    export let product;
    let reviews = [];
    let newComment = '';


    async function submitComment() {
        if (newComment.trim() === '') { return }

        const res = await fetch(`http://localhost:4002/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id, content: newComment }),
        });
        newComment = ''
        await reload()
    }

    async function deleteReview(review_id) {
        const res = await fetch(`http://localhost:4002/reviews`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id, review_id }),
        });
        await reload();
    }

    async function reload() {
        const res = await fetch(`http://localhost:4002/reviews/${product.id}`, { method: 'GET' });
        const data = await res.json();
        ReviewStore.set(data)
    }

    onMount(async () => {
        await reload();
    });

    ReviewStore.subscribe((_reviews) => {
        reviews = _reviews
    });
</script>

<div class="reviews-container">
    <h2>Customer Reviews</h2>
    <div class="comment-form">
        <textarea bind:value={newComment} placeholder="Write your review..."></textarea>
        <button on:click={submitComment}>Submit</button>
    </div>

    <ul>
        {#each reviews as review (review.review_id)}
            <li class="review-item">
                <div class="review-content">{review.content}</div>
                <button class="delete-button" on:click={() => deleteReview(review.review_id)}>🗑️</button>
            </li>
        {/each}
    </ul>
</div>

<style>
    .reviews-container {
        padding: 16px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .reviews-container h2 {
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 600;
    }

    .comment-form {
        margin-bottom: 24px;
    }

    .comment-form textarea {
        width: 100%;
        height: 80px;
        padding: 8px;
        margin-bottom: 8px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-size: 16px;
        resize: vertical;
    }

    .comment-form button {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }

    .comment-form button:hover {
        background-color: #0056b3;
    }

    .review-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ddd;
    }

    .review-content {
        margin-top: 4px;
        font-size: 16px;
    }

    .delete-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #ff6b6b;
        transition: color 0.2s;
    }

    .delete-button:hover {
        color: #ff1c1c;
    }
</style>