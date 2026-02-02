<?php
namespace DreamSites\DreamSearch\Plugin\Model;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Api\ProductRepositoryInterfaceFactory;
use Magento\Catalog\Model\Session as AjaxSearchSession;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\Pricing\Helper\Data;

class Layer
{
    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var AjaxSearchSession
     */
    private $ajaxSearchSession;

    /**
     * @var ProductRepositoryInterfaceFactory
     */
    protected $productRepositoryFactory;

    /**
     * @var \Magento\Framework\Pricing\Helper\Data
     */
    private $priceHelper;

    /**
     * Layer constructor.
     * @param ProductRepositoryInterface $productRepositoryInterface
     * @param StoreManagerInterface $storeManager
     * @param ProductRepositoryInterfaceFactory $productRepositoryFactory
     * @param AjaxSearchSession $ajaxSearchSession
     */
    public function __construct(
        ProductRepositoryInterface $productRepositoryInterface,
        StoreManagerInterface $storeManager,
        ProductRepositoryInterfaceFactory $productRepositoryFactory,
        AjaxSearchSession $ajaxSearchSession,
        Data $priceHelper
    )
    {
        $this->productRepository = $productRepositoryInterface;
        $this->storeManager = $storeManager;
        $this->productRepositoryFactory = $productRepositoryFactory;
        $this->ajaxSearchSession = $ajaxSearchSession;
        $this->priceHelper = $priceHelper;
    }

    /**
     * @return AjaxSearchSession
     */
    private function getAjaxSearchSession(): AjaxSearchSession
    {
        return $this->ajaxSearchSession;
    }

    /**
     * @param \Magento\Catalog\Model\Layer $subject
     * @param $collection
     * @return mixed
     * @throws \JsonException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function afterGetProductCollection(\Magento\Catalog\Model\Layer $subject, $collection)
    {
        if($this->getAjaxSearchSession()->getIsAjaxSearch()) {
            // Add short_description to collection attributes
            $collection->addAttributeToSelect('short_description');
            $collection->addAttributeToSelect('description');

            if (count($collection->getItems())) {
                $count = 0;
                $items = $collection->getItems();
                $prodArray = [];
                foreach ($items as $item) {
                    // Get prices - try multiple methods
                    $rawPrice = $item->getPrice();
                    $finalPrice = $item->getFinalPrice();
                    $priceInfo = $item->getPriceInfo();

                    // Get description - try short_description first, then description
                    $shortDesc = $item->getShortDescription();
                    $fullDesc = $item->getDescription();
                    $description = $shortDesc ?: $fullDesc;

                    // Clean and truncate description
                    if ($description) {
                        $cleanDesc = strip_tags($description);
                        $cleanDesc = trim($cleanDesc);
                        $description = substr($cleanDesc, 0, 100);
                    } else {
                        $description = '';
                    }

                    // Use final price if raw price is 0
                    $usePrice = ($rawPrice > 0) ? $rawPrice : $finalPrice;

                    $prodArray[$count]['id'] = (int)$item->getId(); // Fixed: use actual product ID
                    $prodArray[$count]['name'] = html_entity_decode($item->getName());
                    $prodArray[$count]['price'] = (float)$usePrice;
                    $prodArray[$count]['formatted_price'] = $this->priceHelper->currency($usePrice, true, false);
                    $prodArray[$count]['desc'] = $description;
                    $prodArray[$count]['url'] = $item->getProductUrl();
                    $prodArray[$count]['link'] = $item->getProductUrl();

                    $mediaUrl = $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);

                    if ($item->getImage() !== null) {
                        $prodArray[$count]['image'] = $mediaUrl . 'catalog/product' . $item->getImage();
                    }
                    $count++;
                }
                $sort = $this->getAjaxSearchSession()->getSort();
                if($sort === 'asc') {
                    usort($prodArray, static function($a, $b) {
                        return $a['price'] <=> $b['price'];
                    });
                } else if($sort === 'desc') {
                    usort($prodArray, static function($a, $b) {
                        return $b['price'] <=> $a['price'];
                    });
                }
                echo json_encode($prodArray, JSON_THROW_ON_ERROR);
                exit;
            } else {
                echo json_encode([], JSON_THROW_ON_ERROR);
                exit;
            }
        }
        return $collection;
    }
}
