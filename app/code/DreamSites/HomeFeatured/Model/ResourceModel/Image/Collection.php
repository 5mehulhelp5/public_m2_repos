<?php
/**
 * Page Collection
 */
namespace DreamSites\HomeFeatured\Model\ResourceModel\Image;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    /**
     * @var string
     */
    protected $_idFieldName = 'image_id';

    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('DreamSites\HomeFeatured\Model\Image', 'DreamSites\HomeFeatured\Model\ResourceModel\Image');
    }

    /**
     * OptionArray for records in dreamsites_blog
     *
     * @return array
     */
    public function toOptionIdArray()
    {
        $res = [];
        $res[] = ['value'=>'', 'label'=>__('Please Select')];
        foreach ($this as $item) {
            $data['value'] = $item->getData('image_id');
            $data['label'] = $item->getData('title');

            $res[] = $data;
        }

        return $res;
    }
}
