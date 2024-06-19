<template>
    <div>
        <h2>Deliverability Rating: {{ rating }}</h2>
    </div>
</template>

<script>

export default {
    props: {
        rating: {
            type: Number,
            default: null
        }
    }

};
</script>