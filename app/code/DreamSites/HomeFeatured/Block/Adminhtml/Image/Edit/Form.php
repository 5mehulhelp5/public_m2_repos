<?php
/**
 * Edit image item form
 */
namespace DreamSites\HomeFeatured\Block\Adminhtml\Image\Edit;

use DreamSites\HomeFeatured\Model\ImageFactory;
use Magento\Backend\Block\Template\Context;
use Magento\Backend\Block\Widget\Form\Generic;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\Registry;
use Magento\Store\Model\System\Store;

class Form extends Generic
{
    protected $imageDataFactory;
    protected $_systemStore;

    /**
     * @param Context $context
     * @param Registry $registry
     * @param FormFactory $formFactory
     * @param ImageFactory $imageDataFactory
     * @param Store $systemStore
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        \DreamSites\HomeFeatured\Model\ImageFactory $imageDataFactory,
        \Magento\Store\Model\System\Store $systemStore,
        array $data = []
    ) {
        $this->imageDataFactory = $imageDataFactory;
        $this->_systemStore = $systemStore;
        parent::__construct($context, $registry, $formFactory, $data);
    }

    /**
     * Prepare form for render
     *
     * @return void
     */
    protected function _prepareLayout()
    {
        parent::_prepareLayout();

        /** @var \Magento\Framework\Data\Form $form */
        //$form = $this->_formFactory->create();
        $form = $this->_formFactory->create(
            ['data' => ['id' => 'edit_form', 'action' => $this->getData('action'), 'method' => 'post', 'enctype' => 'multipart/form-data']]
        );

        $imageId = $this->_coreRegistry->registry('current_image_id');
        /** @var \DreamSites\HomeFeatured\Model\ImageFactory $imageData */
        if ($imageId === null) {
            $imageData = $this->imageDataFactory->create();
        } else {
            $imageData = $this->imageDataFactory->create()->load($imageId);
        }

        $yesNo = [];
        $yesNo[0] = 'No';
        $yesNo[1] = 'Yes';

        $horizontalPositions = $imageData->getAvailableHorizontalPositions();
        $verticalPositions = $imageData->getAvailableVerticalPositions();

        $fieldset = $form->addFieldset('base_fieldset', ['legend' => __('Basic Information')]);

        $fieldset->addField(
            'featured_name',
            'text',
            [
                'name' => 'featured_name',
                'label' => __('Featured Name'),
                'title' => __('Featured Name'),
                'required' => true
            ]
        );

        $fieldset->addField(
            'heading',
            'text',
            [
                'name' => 'heading',
                'label' => __('Heading'),
                'title' => __('Heading'),
                'required' => false
            ]
        );

        $fieldset->addField(
            'title',
            'text',
            [
                'name' => 'title',
                'label' => __('Title'),
                'title' => __('Title'),
                'required' => false
            ]
        );

        $fieldset->addField(
            'link_text',
            'text',
            [
                'name' => 'link_text',
                'label' => __('Link Text'),
                'title' => __('Link Text'),
                'required' => false
            ]
        );

        $fieldset->addField(
            'url',
            'text',
            [
                'name' => 'url',
                'label' => __('URL'),
                'title' => __('URL'),
                'required' => false
            ]
        );

        //if we have image filename show preview
        if ($imageData->getImageFilename() !== null) {
            $imageUrl = $this->_storeManager->getStore()->getBaseUrl(
                    \Magento\Framework\UrlInterface::URL_TYPE_MEDIA
                ) . 'featured/' . $imageData->getImageFilename();

            $fieldset->addField(
                'image_preview',
                'note',
                [
                    'label' => __('Current Image Preview'),
                    'text' => '<img src="' . $imageUrl . '" alt="' . $imageData->getImageAlt() . '" style="max-width:200px; max-height:200px;" />'
                ]
            );
        }

        $fieldset->addField(
            'image_filename',
            'file',
            [
                'name' => 'image_filename',
                'label' => __('Image'),
                'title' => __('Image'),
                'required' => false
            ]
        );

        $fieldset->addField(
            'image_alt',
            'text',
            [
                'name' => 'image_alt',
                'label' => __('Image Alt'),
                'title' => __('Image Alt'),
                'required' => false
            ]
        );

        $fieldset->addField(
            'sort_order',
            'text',
            [
                'name' => 'sort_order',
                'label' => __('Sort Order'),
                'title' => __('Sort Order'),
                'required' => true,
                'class' => 'validate-number',
            ]
        );

        $fieldset->addField(
            'heading_colour',
            'text',
            [
                'name' => 'heading_colour',
                'label' => __('Heading Colour'),
                'title' => __('Heading Colour'),
                'required' => false,
                'note' => 'search "color picker" on Google and select the HEX',
            ]
        );

        $fieldset->addField(
            'title_colour',
            'text',
            [
                'name' => 'title_colour',
                'label' => __('Title Colour'),
                'title' => __('Title Colour'),
                'required' => false,
            ]
        );

        $fieldset->addField(
            'link_colour',
            'text',
            [
                'name' => 'link_colour',
                'label' => __('Link Colour'),
                'title' => __('Link Colour'),
                'required' => false,
            ]
        );

        if ($imageData->getId() !== null) {
            // If edit add id
            $form->addField('image_id', 'hidden', ['name' => 'image_id', 'value' => $imageData->getId()]);
        }

        if ($this->_backendSession->getImageData()) {
            $form->addValues($this->_backendSession->getImageData());
            $this->_backendSession->setImageData(null);
        } else {
            $form->addValues(
                [
                    'id' => $imageData->getId(),
                    'featured_name' => $imageData->getFeaturedName(),
                    'sort_order' => $imageData->getSortOrder(),
                    'heading' => $imageData->getHeading(),
                    'title' => $imageData->getTitle(),
                    'link_text' => $imageData->getLinkText(),
                    'image_filename' => $imageData->getImageFilename(),
                    'image_alt' => $imageData->getImageAlt(),
                    'url' => $imageData->getUrl(),
                    'heading_colour' => $imageData->getHeadingColour(),
                    'title_colour' => $imageData->getTitleColour(),
                    'link_colour' => $imageData->getLinkColour(),
                ]
            );
        }

        $form->setUseContainer(true);
        $form->setId('edit_form');
        $form->setAction($this->getUrl('*/*/save'));
        $form->setMethod('post');
        $this->setForm($form);
    }
}
