<?php

namespace App\Blocks;

class Block
{
    protected $folderName;
    protected $blockMetadataPath;
    protected $blockMetadata;

    public function __construct(string $folderName)
    {
        $this->folderName = $folderName;
        $this->setMetadata();
        $this->register();
    }

    private function setMetadata(): void
    {
        $this->blockMetadataPath = get_theme_file_path("/resources/scripts/blocks/{$this->folderName}/block.json");;

        if (file_exists($this->blockMetadataPath)) {
            $this->blockMetadata = json_decode(file_get_contents($this->blockMetadataPath), true);
        }
    }

    private function register()
    {
        $args = [];

        if (isset($this->blockMetadata['render'])) {
            $args['render_callback'] = function ($attributes, $content) {
                $view = "blocks.{$this->folderName}.{$this->blockMetadata['render']}";
                $data = $this->prepareData(['attributes' => $attributes, 'content' => $content]);

                if (\View::exists($view)) {

                    return view($view, $data)->render();
                }

                return $content;
            };
        }

        register_block_type($this->blockMetadataPath, $args);
    }

    protected function prepareData(array $data): array
    {
        return $data;
    }
}
