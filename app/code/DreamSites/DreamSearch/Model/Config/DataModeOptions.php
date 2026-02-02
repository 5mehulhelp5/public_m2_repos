<?php

namespace DreamSites\DreamSearch\Model\Config;

use Magento\Framework\Option\ArrayInterface;

class DataModeOptions implements ArrayInterface
{
    public const DATA_MODE_GRID = 'grid';
    public const DATA_MODE_LIST = 'list';

    /**
     * @return array
     */
    public function toOptionArray()
    {
        return [
            self::DATA_MODE_GRID => __('Grid'),
            self::DATA_MODE_LIST => __('List'),
        ];
    }
}
