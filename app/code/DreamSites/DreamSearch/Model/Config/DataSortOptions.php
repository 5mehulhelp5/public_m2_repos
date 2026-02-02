<?php

namespace DreamSites\DreamSearch\Model\Config;

use Magento\Framework\Option\ArrayInterface;

class DataSortOptions implements ArrayInterface
{
    public const DATA_SORT_RELEVANCE = 'relevance';
    public const DATA_SORT_ASCENDING = 'ascending';
    public const DATA_SORT_DESCENDING = 'descending';

    /**
     * @return array
     */
    public function toOptionArray()
    {
        return [
            self::DATA_SORT_RELEVANCE => __('Relevance'),
            self::DATA_SORT_ASCENDING => __('Price Ascending'),
            self::DATA_SORT_DESCENDING => __('Price Descending'),
        ];
    }
}
