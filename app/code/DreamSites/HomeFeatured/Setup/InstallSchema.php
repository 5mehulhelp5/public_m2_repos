<?php

namespace DreamSites\HomeFeatured\Setup;

use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class InstallSchema implements InstallSchemaInterface
{
    public function install(SchemaSetupInterface   $setup,
                            ModuleContextInterface $context
    )
    {
        $installer = $setup;
        $installer->startSetup();

        /**
         * Create table 'dreamsites_featured'
         */
        $table = $installer->getConnection()->newTable(
            $installer->getTable('dreamsites_featured')
        )->addColumn(
            'image_id',
            Table::TYPE_INTEGER,
            null,
            ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true],
            'Image ID'
        )->addColumn(
            'featured_name',
            Table::TYPE_TEXT,
            255,
            ['nullable' => false],
            'Featured Name'
        )->addColumn(
            'image_filename',
            Table::TYPE_TEXT,
            255,
            ['nullable' => false],
            'Image Filename'
        )->addColumn(
            'image_alt',
            Table::TYPE_TEXT,
            255,
            ['nullable' => false],
            'Image Alt Text'
        )->addColumn(
            'url',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'URL'
        )->addColumn(
            'heading',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Heading'
        )->addColumn(
            'heading_colour',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Heading Colour'
        )->addColumn(
            'title',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Image Title'
        )->addColumn(
            'title_colour',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Title Colour'
        )->addColumn(
            'link_text',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Link Text'
        )->addColumn(
            'link_colour',
            Table::TYPE_TEXT,
            255,
            ['nullable' => true],
            'Link Colour'
        )->addColumn(
            'sort_order',
            Table::TYPE_SMALLINT,
            null,
            ['nullable' => false, 'default' => '0', 'unsigned' => true],
            'Link Colour'
        )->addColumn(
            'created_at',
            Table::TYPE_TIMESTAMP,
            null,
            ['nullable' => false],
            'Creation Time'
        )->addColumn(
            'updated_at',
            Table::TYPE_TIMESTAMP,
            null,
            ['nullable' => false],
            'Modification Time'
        )->setComment(
            'Home Page Featured Images Upload Table'
        );
        $installer->getConnection()->createTable($table);
        $installer->endSetup();
    }
}
