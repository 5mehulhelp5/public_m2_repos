<?php
/**
 * UpgradeSchema.php
 * Author: Kashif Bhatti
 * 13/11/2025
 */
namespace DreamSites\HomeCarousel\Setup;

use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class UpgradeSchema implements UpgradeSchemaInterface
{
    /**
     * {@inheritdoc}
     */
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if (version_compare($context->getVersion(), '1.0.1', '<')) {
            $connection = $setup->getConnection();

            $column = [
                'type' => Table::TYPE_SMALLINT,
                'nullable' => false,
                'comment' => 'Sort Order',
                'default' => '0',
                'after' => 'is_active',
                'unsigned' => true,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'sort_order', $column);

            $column = [
                'type' => Table::TYPE_SMALLINT,
                'nullable' => false,
                'comment' => 'Left, Centre or Right',
                'default' => '0',
                'after' => 'sort_order',
                'unsigned' => true,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'position', $column);

            $column = [
                'type' => Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Button Colour',
                'after' => 'position',
                'length' => 255,//in add column we use length instead of size
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'button_colour', $column);

            $column = [
                'type' => Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Button Text Colour',
                'after' => 'button_colour',
                'length' => 255,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'button_text_colour', $column);

            $column = [
                'type' => Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Heading Colour',
                'after' => 'button_text_colour',
                'length' => 255,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'heading_colour', $column);

            $column = [
                'type' => Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Title Colour',
                'after' => 'heading_colour',
                'length' => 255,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'title_colour', $column);

            $column = [
                'type' => Table::TYPE_TEXT,
                'nullable' => true,
                'comment' => 'Top, Middle or Bottom',
                'after' => 'position',
                'length' => 255,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'vertical_position', $column);
        }

        if (version_compare($context->getVersion(), '1.0.2', '<')) {
            $connection = $setup->getConnection();

            $connection->dropColumn($setup->getTable('dreamsites_carousel'), 'position');
            $connection->dropColumn($setup->getTable('dreamsites_carousel'), 'vertical_position');

            $column = [
                'type' => Table::TYPE_SMALLINT,
                'nullable' => false,
                'comment' => 'Left 0, Centre 1 or Right 2',
                'after' => 'sort_order',
                'default' => 0,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'horizontal_position', $column);

            $column = [
                'type' => Table::TYPE_SMALLINT,
                'nullable' => false,
                'comment' => 'Top 0, Middle 1 or Bottom 2',
                'after' => 'horizontal_position',
                'default' => 0,
            ];
            $connection->addColumn($setup->getTable('dreamsites_carousel'), 'vertical_position', $column);
        }

        $setup->endSetup();
    }
}
