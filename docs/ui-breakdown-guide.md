# `ui-breakdown.yml` Edit Reference

## Block-level fields

```yaml
my-block:
  render: innerblocks-parent   # server-side | client-side | innerblocks-parent
  php_wrapper: true            # add only when block needs PHP render + InnerBlocks.Content
  skip: true                   # add to exclude this block from registration
  controls: [...]
  inner_blocks: [...]          # omit if no child blocks
  data_source: {...}           # omit if not a data-query block
```

---

## `controls` — one entry per editor control

```yaml
controls:
  # Enum — 2–4 options
  - label: Layout
    type: ToggleGroupControl
    attr: layout
    options: [list, carousel]
    default: list              # omit if no meaningful default

  # Enum — 5+ options
  - label: Position
    type: SelectControl
    attr: bgPosition
    options: [center, top, bottom, left, right]
    default: center

  # Boolean toggle
  - label: Open First on Load
    type: ToggleControl
    attr: isOpenedByDefault    # always use is prefix for booleans

  # Color picker
  - label: Background Color
    type: ColorPaletteControl
    attr: bgColor

  # Image / video upload
  - label: Image
    type: MediaControl
    attr: image

  # Number slider
  - label: Overlay Opacity
    type: RangeControl
    attr: overlayOpacity

  # Free text
  - label: Button Label
    type: TextControl
    attr: buttonLabel

  # Preview toggle (data-query blocks only)
  - label: Enable Preview
    type: PreviewControl
    attr: isPreview

  # Spacing — always one line, no attr needed
  - label: Spacing
    type: ResponsiveSpacingControl
```

---

## `inner_blocks` — child block definition

```yaml
inner_blocks:
  - slug: accordion-item       # child block slug (ssm/ prefix added automatically)
    attrs:
      - {name: title, type: string, control: RichText}
      - {name: image, type: object, control: MediaControl}
      - {name: url, type: string, control: LinkControl}
      - {name: linkIsOpenInNewTab, type: boolean, control: LinkControl}
      - {name: content, control: InnerBlocks}                          # open InnerBlocks
      - {name: content, control: InnerBlocks, allowed: [core/heading, core/paragraph]}
```

**`control` values for attrs:** `RichText` · `TextControl` · `MediaControl` · `ColorPaletteControl` · `ToggleControl` · `LinkControl` · `InnerBlocks`

---

## `data_source` — query config

```yaml
data_source:
  type: cpt                    # cpt | taxonomy
  name: frh_property           # post type slug or taxonomy slug
  query_attrs: [queryType, numberOfPosts, curatedTerms, curatedPosts]
```

---

## Common edits

| What you want | What to change |
|---|---|
| Change control type | Edit `type:` on the control row |
| Rename an attribute | Edit `attr:` on the control row |
| Add a new control | Add a new `- label/type/attr` entry under `controls` |
| Remove a control | Delete the entry |
| Change enum options | Edit `options: [...]` list |
| Skip a block | Add `skip: true` under the block key |
| Mark as needing PHP wrapper | Add `php_wrapper: true` under the block key |
| Add a child block attribute | Add entry to `inner_blocks[n].attrs` |
