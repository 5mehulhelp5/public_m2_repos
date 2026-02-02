<?php
/**
 * Page Model
 */
namespace DreamSites\HomeFeatured\Model;

use Magento\Framework\Model\AbstractModel;
use Magento\Store\Model\StoreManagerInterface;

class Image extends AbstractModel
{
    /**
     * @var StoreManagerInterface
     */
    private $_storeManager;

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('DreamSites\HomeFeatured\Model\ResourceModel\Image');
        parent::_construct();
    }

    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        ?\Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        ?\Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_storeManager = $storeManager;
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    public function getMediaPath()
    {
        return $this->_storeManager->getStore()->getBaseUrl(
                \Magento\Framework\UrlInterface::URL_TYPE_MEDIA
            ) . 'featured/' . $this->getImageFilename();
    }

    /**
     * @return mixed
     */
    public function getSortOrder()
    {
        return $this->getData('sort_order');
    }

    /**
     * @param $sortOrder
     * @return mixed
     */
    public function setSortOrder($sortOrder)
    {
        return $this->setData('sort_order', $sortOrder);
    }

    /**
     * @return mixed
     */
    public function getImageId()
    {
        return $this->getData('image_id');
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->getData('title');
    }

    /**
     * @param $title
     * @return Image
     */
    public function setTitle($title)
    {
        return $this->setData('title', $title);
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->getData('created_at');
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->getData('updated_at');
    }

    /**
     * @return mixed
     */
    public function getLinkText()
    {
        return $this->getData('link_text');
    }

    /**
     * @param $linkText
     * @return Image
     */
    public function setLinkText($linkText)
    {
        return $this->setData('link_text', $linkText);
    }

    /**
     * @return mixed
     */
    public function getLinkColour()
    {
        return $this->getData('link_colour');
    }

    /**
     * @param $linkColour
     * @return Image
     */
    public function setLinkColour($linkColour)
    {
        return $this->setData('link_colour', $linkColour);
    }

    /**
     * @return mixed
     */
    public function getTitleColour()
    {
        return $this->getData('title_colour');
    }

    /**
     * @param $titleColour
     * @return Image
     */
    public function setTitleColour($titleColour)
    {
        return $this->setData('title_colour', $titleColour);
    }

    /**
     * @return mixed
     */
    public function getHeadingColour()
    {
        return $this->getData('heading_colour');
    }

    /**
     * @param $headingColour
     * @return Image
     */
    public function setHeadingColour($headingColour)
    {
        return $this->setData('heading_colour', $headingColour);
    }

    /**
     * @return mixed
     */
    public function getImageFilename()
    {
        return $this->getData('image_filename');
    }

    /**
     * @param $imageFilename
     * @return Image
     */
    public function setImageFilename($imageFilename)
    {
        return $this->setData('image_filename', $imageFilename);
    }

    /**
     * @return mixed
     */
    public function getImageAlt()
    {
        return $this->getData('image_alt');
    }

    /**
     * @param $imageAlt
     * @return Image
     */
    public function setImageAlt($imageAlt)
    {
        return $this->setData('image_alt', $imageAlt);
    }

    /**
     * @return mixed
     */
    public function getHeading()
    {
        return $this->getData('heading');
    }

    /**
     * @param $heading
     * @return Image
     */
    public function setHeading($heading)
    {
        return $this->setData('heading', $heading);
    }

    /**
     * @return mixed
     */
    public function getUrl()
    {
        return $this->getData('url');
    }

    /**
     * @param $url
     * @return Image
     */
    public function setUrl($url)
    {
        return $this->setData('url', $url);
    }

    /**
     * @return mixed
     */
    public function getFeaturedName()
    {
        return $this->getData('featured_name');
    }

    /**
     * @param $featuredName
     * @return Image
     */
    public function setFeaturedName($featuredName)
    {
        return $this->setData('featured_name', $featuredName);
    }
}
