<?php
/**
 * Class Home
 * Author: Kashif Bhatti
 * 04/11/2025
 */

namespace DreamSites\NewProducts\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory as ProductCollectionFactory;
use Magento\Catalog\Model\CategoryFactory;
use Magento\Catalog\Helper\Image as ImageHelper;
use Magento\Framework\Pricing\Helper\Data as PriceHelper;
use DreamSites\NewProducts\Helper\Data as NewProductsHelper;

class Home extends Template
{
    /**
     * @var ProductCollectionFactory
     */
    protected $productCollectionFactory;

    /**
     * @var CategoryFactory
     */
    protected $categoryFactory;

    /**
     * @var ImageHelper
     */
    protected $imageHelper;

    /**
     * @var PriceHelper
     */
    protected $priceHelper;

    /**
     * @var NewProductsHelper
     */
    protected $newProductsHelper;

    /**
     * @var array
     */
    protected $categoryProducts = null;

    /**
     * @var array
     */
    protected $categories = null;

    /**
     * @param Context $context
     * @param ProductCollectionFactory $productCollectionFactory
     * @param CategoryFactory $categoryFactory
     * @param ImageHelper $imageHelper
     * @param PriceHelper $priceHelper
     * @param NewProductsHelper $newProductsHelper
     * @param array $data
     */
    public function __construct(
        Context $context,
        ProductCollectionFactory $productCollectionFactory,
        CategoryFactory $categoryFactory,
        ImageHelper $imageHelper,
        PriceHelper $priceHelper,
        NewProductsHelper $newProductsHelper,
        array $data = []
    ) {
        $this->productCollectionFactory = $productCollectionFactory;
        $this->categoryFactory = $categoryFactory;
        $this->imageHelper = $imageHelper;
        $this->priceHelper = $priceHelper;
        $this->newProductsHelper = $newProductsHelper;
        parent::__construct($context, $data);
    }

    /**
     * Get configured category IDs
     *
     * @return array|null
     */
    public function getNewProductsCategories()
    {
        $homeNewProductsEnabled = filter_var(
            $this->_scopeConfig->getValue('dreamsites_newproducts/newproducts/product_enabled'),
            FILTER_VALIDATE_BOOLEAN
        );

        if ($homeNewProductsEnabled) {
            $categories = $this->_scopeConfig->getValue(
                'dreamsites_newproducts/newproducts/categories',
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE
            );
            if (!empty($categories)) {
                return explode(",", $categories);
            }
        }
        return null;
    }

    /**
     * Get category products organized by category
     *
     * @return array
     */
    public function getCategoryProducts()
    {
        if ($this->categoryProducts === null) {
            $this->loadCategoryProducts();
        }
        return $this->categoryProducts;
    }

    /**
     * Get categories
     *
     * @return array
     */
    public function getCategories()
    {
        if ($this->categories === null) {
            $this->loadCategoryProducts();
        }
        return $this->categories;
    }

    /**
     * Get first category key
     *
     * @return string
     */
    public function getFirstCategoryKey()
    {
        $categories = $this->getCategories();
        if (!empty($categories)) {
            return array_key_first($categories);
        }
        return '';
    }

    /**
     * Load category products
     *
     * @return void
     */
    protected function loadCategoryProducts()
    {
        $this->categoryProducts = [];
        $this->categories = [];

        $categoryIds = $this->getNewProductsCategories();

        if (isset($categoryIds)) {
            foreach ($categoryIds as $categoryId) {
                $category = $this->categoryFactory->create()->load($categoryId);
                $this->categories[$category->getUrlKey()] = $category->getName();

                $productCollection = $this->productCollectionFactory->create()
                    ->addAttributeToSelect('*')
                    ->addCategoryFilter($category)
                    ->addAttributeToFilter('status', \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
                    ->addAttributeToFilter('visibility', 4)
                    ->setPageSize(10);

                // Add media gallery data to each product
                $productCollection->addMediaGalleryData();

                $productCollection->load();

                $key = strtolower($category->getUrlKey());
                $this->categoryProducts[$key] = $productCollection;
            }
        }
    }

    /**
     * Get product data for display
     *
     * @param \Magento\Catalog\Model\Product $product
     * @return array
     */
    public function getProductData($product)
    {
        $productImageUrl = $this->imageHelper->init($product, 'product_base_image')->getUrl();
        $productName = $product->getName();
        $finalPrice = $product->getFinalPrice();
        $productPrice = $this->priceHelper->currency($finalPrice, true, false);
        $productUrl = $product->getProductUrl();
        $shortDescription = $product->getShortDescription();
        $longDescription = $product->getDescription();
        $productOptions = $this->newProductsHelper->getProductOptions($product);
        $reviewData = $this->newProductsHelper->getProductReviewData($product);
        $galleryImages = $this->getProductGalleryImages($product);

        return [
            'id' => $product->getId(),
            'name' => $productName,
            'price' => $productPrice,
            'price_raw' => $finalPrice,
            'image' => $productImageUrl,
            'gallery_images' => $galleryImages,
            'short_description' => $shortDescription,
            'description' => $longDescription,
            'url' => $productUrl,
            'sku' => $product->getSku(),
            'typeId' => $product->getTypeId(),
            'options' => $productOptions,
            'rating_summary' => $reviewData['rating_summary'],
            'reviews_count' => $reviewData['reviews_count']
        ];
    }

    /**
     * Get product gallery images (max 5)
     *
     * @param \Magento\Catalog\Model\Product $product
     * @return array
     */
    protected function getProductGalleryImages($product)
    {
        $images = [];

        // Get media gallery data from product
        $mediaGallery = $product->getData('media_gallery');

        if ($mediaGallery && isset($mediaGallery['images']) && is_array($mediaGallery['images'])) {
            $count = 0;
            $storeMediaUrl = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);

            foreach ($mediaGallery['images'] as $image) {
                if ($count >= 5) {
                    break;
                }

                // Skip disabled images
                if (isset($image['disabled']) && $image['disabled']) {
                    continue;
                }

                $images[] = [
                    'url' => $storeMediaUrl . 'catalog/product' . $image['file'],
                    'label' => isset($image['label']) ? $image['label'] : $product->getName()
                ];
                $count++;
            }
        }

        // If no gallery images, at least return the main image
        if (empty($images)) {
            $images[] = [
                'url' => $this->imageHelper->init($product, 'product_base_image')->getUrl(),
                'label' => $product->getName()
            ];
        }

        return $images;
    }

    /**
     * Get helper
     *
     * @return NewProductsHelper
     */
    public function getHelper()
    {
        return $this->newProductsHelper;
    }

    /**
     * Get image helper
     *
     * @return ImageHelper
     */
    public function getImageHelper()
    {
        return $this->imageHelper;
    }

    /**
     * Get price helper
     *
     * @return PriceHelper
     */
    public function getPriceHelper()
    {
        return $this->priceHelper;
    }
}
