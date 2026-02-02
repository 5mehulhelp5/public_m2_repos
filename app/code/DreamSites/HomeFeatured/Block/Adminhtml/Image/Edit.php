<?php
/**
 * Form container for Image edit/new
 */
namespace DreamSites\HomeFeatured\Block\Adminhtml\Image;

use Magento\Backend\Block\Widget\Form\Container;

class Edit extends Container
{
    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $coreRegistry;

    /**
     * Current image record id
     *
     * @var bool|int
     */
    protected $imageId = false;

    /**
     * Constructor
     *
     * @param \Magento\Backend\Block\Widget\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Widget\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->coreRegistry = $registry;
        parent::__construct($context, $data);
    }

    /**
     * Remove Delete button if record can't be deleted.
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_objectId = 'image_id';
        $this->_controller = 'adminhtml_image';
        $this->_blockGroup = 'DreamSites_HomeFeatured';

        parent::_construct();

        $imageId = $this->getImageId();
        if (!$imageId) {
            $this->buttonList->remove('delete');
        }
    }

    /**
     * Retrieve the header text, either editing an existing record or creating a new one.
     *
     * @return \Magento\Framework\Phrase
     */
    public function getHeaderText()
    {
        $imageId = $this->getImageId();
        if (!$imageId) {
            return __('New Home Featured Item');
        } else {
            return __('Edit Home Featured Item');
        }
    }

    public function getImageId()
    {
        if (!$this->imageId) {
            $this->imageId=$this->coreRegistry->registry('current_image_id');
        }
        return $this->imageId;
    }
}
