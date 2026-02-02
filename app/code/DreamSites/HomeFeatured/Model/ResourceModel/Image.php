<?php
/**
 * Page MySQL Resource
 */
namespace DreamSites\HomeFeatured\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;
use Magento\Framework\Model\ResourceModel\Db\Context;
use Magento\Framework\Stdlib\DateTime\DateTime;

class Image extends AbstractDb
{

    /**
     * @var \Magento\Framework\Stdlib\DateTime\DateTime
     */
    protected $_date;

    /**
     * Construct
     *
     * @param Context $context
     * @param DateTime $date
     * @param string|null $connectionName
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Framework\Stdlib\DateTime\DateTime $date,
        ?string $connectionName = null
    ) {
        parent::__construct($context, $connectionName);
        $this->_date = $date;
    }

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('dreamsites_featured', 'image_id');
    }

    /**
     * Process page data before saving
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return $this
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object)
    {

        if ($object->isObjectNew() && !$object->hasData('created_at')) {
            $object->setData('created_at', $this->_date->gmtDate());
        }

        $object->setData('updated_at', $this->_date->gmtDate());

        return parent::_beforeSave($object);
    }

    public function getTitle(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getTitle();
    }

    public function getImageId(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getImageId();
    }

    public function getHeading(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getHeading();
    }

    public function getImageFilename(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getImageFilename();
    }

    public function getImageAlt(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getImageAlt();
    }

    public function getUrl(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getUrl();
    }

    public function getLinkText(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getLinkText();
    }

    public function getFeaturedName(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getFeaturedName();
    }

    public function getSortOrder(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getSortOrder();
    }

    public function getHeadingColour(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getHeadingColour();
    }

    public function getTitleColour(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getTitleColour();
    }

    public function getLinkColour(\DreamSites\HomeFeatured\Model\Image $image)
    {
        return $image->getLinkColour();
    }
}
