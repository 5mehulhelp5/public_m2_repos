<template>
    <a
        v-bind:href="item_url"
        class="search__link"
    >
        <div class="image__container">
            <img
                v-bind:src="item_image"
                class="search__image"
                :alt="item_name"
            />
        </div>
        <div class="search__copy">
            <span
                class="search__product_name"
                v-text="item_name"
            ></span>
            <span
                class="search__product_desc"
                v-text="item_desc"
            ></span>
        </div>
        <div class="search__product-card"
            ><span class="product_label"><strong>Price: </strong></span>
            <span
                class="product_price"
                v-text="item_formatted_price"
            ></span
        ></div>
    </a>
</template>

<script>
export default {
    props: {
        item_id: {
            type: Number,
            default: 0,
            required: true,
        },
        item_name: {
            type: String,
            default: '',
            required: true,
        },
        item_link: {
            type: String,
            default: '',
            required: false,
        },
        item_image: {
            type: String,
            default: '',
            required: true,
        },
        item_desc: {
            type: String,
            default: '',
            required: false,
        },
        item_price: {
            type: Number,
            default: 0,
            required: true,
        },
        item_formatted_price: {
            type: String,
            default: '',
            required: true,
        },
        item_url: {
            type: String,
            default: '',
            required: true,
        },
    }
}
</script>
